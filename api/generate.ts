import { supabaseAdmin } from './_utils/supabase.js';
import { downloadAndConvertToBase64 } from './_utils/storage.js';
import * as path from 'path';
import * as fs from 'fs';

// Helper to upload Base64 image to Supabase Storage
async function uploadToStorage(userId: string, base64Data: string, folder: string = 'generated-images'): Promise<string> {
  const buffer = Buffer.from(base64Data.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.png`;
  const filePath = `${userId}/${fileName}`;

  const { error } = await supabaseAdmin.storage
    .from(folder)
    .upload(filePath, buffer, {
      contentType: 'image/png',
      upsert: false
    });

  if (error) throw error;
  return filePath;
}

// Helper to get Signed URL
async function getSignedUrl(bucket: string, path: string): Promise<string> {
    const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .createSignedUrl(path, 60 * 60 * 24 * 365); // 1 year expiry for simplicity, or handle refresh in frontend
    
    if (error || !data) return '';
    return data.signedUrl;
}

// Vercel Serverless Function
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const baseUrl = process.env.GEMINI_BASE_URL;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured' });
  }

  if (!baseUrl) {
    return res.status(500).json({ error: 'Gemini API base URL not configured' });
  }

  // Helper to log API interactions (CSV)
  const logApiInteraction = (mode: string, requestBody: any, responseBody: any) => {
    // Only log in development/local
    if (process.env.VERCEL_ENV !== 'production') {
      try {
        const logDir = path.join(process.cwd(), 'tests', 'data');
        if (!fs.existsSync(logDir)) {
          // If tests/data doesn't exist, try creating it or fallback
          try {
             fs.mkdirSync(logDir, { recursive: true });
          } catch {
             // Fallback to tmp or ignore
             return;
          }
        }
        
        const filename = path.join(logDir, 'api_logs.csv');
        const timestamp = new Date().toISOString();
        
        // Helper to sanitize/truncate large data
        const sanitize = (obj: any): string => {
            const str = JSON.stringify(obj, (key, value) => {
                if (typeof value === 'string' && value.length > 500 && (key.toLowerCase().includes('image') || key.toLowerCase().includes('base64') || key === 'data')) {
                    return `[BASE64_DATA_TRUNCATED_LEN_${value.length}]`;
                }
                return value;
            });
            // Escape double quotes for CSV
            return str.replace(/"/g, '""');
        };

        const reqStr = sanitize(requestBody);
        const resStr = sanitize(responseBody);
        
        const csvLine = `"${timestamp}","${mode}","${reqStr}","${resStr}"\n`;
        
        if (!fs.existsSync(filename)) {
            fs.writeFileSync(filename, 'Timestamp,Mode,Request,Response\n');
        }
        fs.appendFileSync(filename, csvLine);
        
        console.log(`[API Log] Appended to ${filename}`);
      } catch (e) {
        console.error('[API Log] Failed to save log:', e);
      }
    }
  };

  // Helper for direct Fetch to Gemini API
  async function callGeminiAPI(model: string, payload: any): Promise<any> {
    const url = `${baseUrl}/models/${model}:generateContent?key=${apiKey}`;
    
    // Log outgoing request (careful with sensitive data)
    console.log(`[API Call] Model: ${model}`);
    // console.log(`[API Call] Payload:`, JSON.stringify(payload).substring(0, 500) + "..."); 

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API Error] Status: ${response.status}`);
      console.error(`[API Error] Body: ${errorText}`);
      // Do not expose raw upstream errors to client in production
      throw new Error(`Generation failed (${response.status}). Please try again.`);
    }

    const json = await response.json();
    // console.log(`[API Response]`, JSON.stringify(json).substring(0, 500) + "...");
    return json;
  }

  // 1. Auth Check
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const { mode, data } = req.body;
  const dryRun = data?.dryRun === true;

  try {
    // 2. Route Logic
    if (mode === 'analyze') {
      // Deduct Credits first (Atomic RPC)
      if (!dryRun) {
        const { error: creditError } = await supabaseAdmin.rpc('consume_credits', {
          p_user_id: user.id,
          p_action_type: 'analyze'
        });

        if (creditError) {
          return res.status(402).json({ error: creditError.message || 'Insufficient credits for analysis' });
        }
      }

      const { images, requirements, language, batchCount, uiLanguage } = data;
      
      if (dryRun) {
         // Simulate processing delay if needed, or just return immediately for baseline
         return res.status(200).json({
             brief: {
                 headline: "Dry Run Headline",
                 subline: "Dry Run Subline",
                 description: "This is a dry run analysis response.",
                 concepts: Array(batchCount || 4).fill({
                     title: "Concept 1",
                     visual: "Visual description",
                     reason: "Reasoning"
                 })
             }
         });
      }

      const count = batchCount || 4;
      const isChineseUI = uiLanguage === 'Chinese' || uiLanguage === 'zh';
      
      // Legacy templates removed - utilizing direct JSON schema instructions in prompt 
      const prompt = `
        **Role:** You are a World-Class Creative Director for Luxury E-commerce Brands.
        **Task:** Analyze the provided product images and User Requirements: "${requirements}" to design a top-tier, high-end visual brief.
        **Language Instruction:** Analyze and describe the visual brief in ${uiLanguage}. However, the "Text Content" fields(Headline, Subline, Description) must be in ${language}.
        **Goal:** Generate ${count} distinct image concepts that elevate the product's listing image for E-commerce. 
        

        1. Enhanced Visual Style Standards:
         - Overall Style: Premium / Minimal / High-end / Creative.
         - Texture: Photorealistic (NO illustration, NO cartoon, NO fake 3D look).
         - Lighting: Advanced lighting (Soft light + Rim light + Clean highlights), clear product edges.
         - Background: Clean but designed (Gradient, micro-texture, soft focus environment, abstract light/shadow).
         - Composition: Premium negative space, strong information hierarchy, magazine ad feel.
         - Creativity: Use "visual metaphors" or "creative props/lighting" to highlight selling points without overpowering the product.
         - Consistency: Unified visual system (Fonts, icons, color blocks, lines, margins, alignment).
         - Aesthetic: Do not use generic terms. Use sophisticated terminology like "Architectural Minimalism," "Kinetic Elegance," or "Organic Futurology."
         - E-commerce Optimization: The style must prioritize Visual Hierarchy. This means creating high-contrast areas for copy, using leading lines to direct the eye to product features, and ensuring the product remains the "Hero."
         - Brand Alignment: The brief should evoke the premium feel of brands like Apple, Dyson, or Rimowa—blending technical precision with lifestyle warmth.

        2. STRICT TYPOGRAPHY REQUIREMENTS:
         - Font Family: You MUST recommend a specific **copyright-free / open-source** font family (e.g., Google Fonts like Roboto, Open Sans, Montserrat, Playfair Display, Lato). DO NOT suggest paid commercial fonts.
         - Font Style: Specify whether it should be Serif or Sans-serif based on the brand vibe.
         - Hierarchy: Clearly define the font sizes/weights for:
           - Headline (e.g., "Bold, 48px")
           - Subline (e.g., "Medium, 24px")
           - Body Text (e.g., "Regular, 16px")

        3. product_physical_description (CRITICAL):
         - Analyze the uploaded product images meticulously.
         - This description will be used to ensure the product does not deform or change in generated images.
         - Automatically identify and infer:
           1. Product type, usage, target audience, and typical usage scenarios.
           2. Material and texture (e.g., metal/plastic/glass/fabric/silicone; matte/glossy/textured).
           3. Structural composition and correct orientation (DO NOT fabricate structures).
           4. If product has a Text Logo, include it in the description.
           5. Create a "Subject Lock" description: A detailed physical description of the product including its exact shape, material (e.g., matte plastic, brushed aluminum), color (e.g., hex code or specific shade), texture, and key features.
          
        4. Reasonable dimensions (based on common sense and human scale, no exaggeration).
        5. 4-6 "convertible" core selling points (experience, efficiency, safety, durability, portability, ease of cleaning, comfort, etc.).
        6. CONSTRAINT: Do NOT mention the original filename (e.g., "image_0.png") in any output field. Always refer to it as "the product", "the item", or by its category name.
 

        **Select primarily from the following 9 archetypes as image_concepts.**: If ${count} exceeds 9, you MUST intelligently create additional relevant concepts or variations to meet the exact target count of ${count}.
        (1) HERO Main Visual (Magazine Ad Style)
         - Content: Product large image + Premium background/creative lighting.
         - Keywords: Premium, clean, iconic.
        (2) Key Benefit #1 (Core Selling Point)
         - Layout: Infographic style: Image + Icon + Bullets.
         - Creative: Use abstract graphics/lighting to emphasize "result/experience"
        (3) Key Benefit #2 (Material/Craftsmanship)
         - Content: Local macro close-up + Material tags (e.g., "Durable", "Soft-touch", "Aerospace-grade" - only if reasonable).
         - Constraint: Do not fabricate non-existent craftsmanship.
        (4) Real Use Scene #1 (Medium Shot)
         - Scene: Real person using it, clean and high-end environment.
         - Focus: Emphasize "Ease of use / Comfort / Efficiency" (adapt to product type).
        (5) Real Use Scene #2 (Close-up Detail)
         - Scene: Hands / Contact points / Key action details.
         - Style: Moderate background blur to highlight product & experience.
        (6) Size & Fit (Size Adaptation)
         - Content: Reasonable size indication + "Fits Most / Compact / Space-Saving" (common sense).
         - Style: Clear, restrained, high-end typography.
        (7) Design Details (Structure & Function)
         - Content: Indicator lines based ONLY on real structure. Do not add fake parts.
         - Style: High-end tech product breakdown aesthetic.
        (8) Problem → Solution (Pain Point vs Solution)
         - Layout: Restrained contrast. Left: Problem scene (messy/inefficient) vs Right: Solved (clean/easier).
         - Elements: Simple icons/checkmarks. No vulgar or exaggerated expressions.
        (9) What’s Included / More Views (List/Angles)
         - Content: Multi-angle display or storage view + Accessories list (only if real).
         - Focus: "Ready to use / Easy to store".

        Output JSON strictly following this schema:
         \`\`\`json
         {
           "safety_check": { "is_safe": boolean, "reason": string },
           "visual_brief_summary": {
             "style": "High-end aesthetic name (min. 30 words)", // MUST be in ${uiLanguage}
             "palette": ["#000000", "#FFFFFF", "#FF0000"], // MUST use valid 6-digit HEX codes
             "lighting": "Studio-quality specification", // MUST be in ${uiLanguage}
             "quality_requirements": "Specific technical quality standards (e.g. '8K UHD, Macro Details' or 'Soft focus, film grain').", // MUST be in ${uiLanguage}
             "target_audience": "Target demographic description (Age, Gender, Interest).", // MUST be in ${uiLanguage}
             "typography_guideline": "Font Family (Copyright-Free), Style (Serif/Sans), and Size Hierarchy details.", // MUST be in ${uiLanguage}
             "product_physical_description": "Detailed Subject Lock description (Shape, Material, Color, Texture, Details)."
           },
           "image_concepts": [
             {
               "concept_name": "Concept Title", // MUST be in ${uiLanguage}
               "composition_details": "Quantifiable layout details", // MUST be in ${uiLanguage}
               "elements_and_props": "High-end props", // MUST be in ${uiLanguage}
               "highlighted_features": "Specific focus", // MUST be in ${uiLanguage}
               "mood_atmosphere": "Evocative keywords", // MUST be in ${uiLanguage}
               "text_content": {
                 "headline": "Main Title (3-6 words, Punchy & Clear, Title Case, in ${language})",
                 "subline": "Subtitle (6-14 words, Value Proposition, Natural & Authentic, in ${language})",
                 "description": "Bullet Points (2-4 items, 2-6 words each, Infographic style, in ${language})"
               }, // Copywriting Style: Restrained & Premium, Benefit-oriented, Ad-ready. Avoid exaggerated absolutes (e.g., '100% Guaranteed').
               "rendering_synthesis_prompt": "High-precision English prompt for AI generation." // MUST be in ${uiLanguage}
             }
           ]
         }
         \`\`\`
       `;

      // Download images from Storage
      let base64Images: string[] = [];
      if (data.imagePaths && Array.isArray(data.imagePaths) && data.imagePaths.length > 0) {
          base64Images = await Promise.all(data.imagePaths.map((p: string) => downloadAndConvertToBase64(p)));
      } else {
         // Fallback or error if no images
         // If images is still passed (legacy), try to use it
         if (data.images && Array.isArray(data.images)) {
             base64Images = data.images.map((img: string) => img.includes(',') ? img.split(',')[1] : img);
         }
      }

      // Construct payload manually
      const parts = [
        { text: prompt },
        ...base64Images.map((base64Data) => {
          return {
            inlineData: { mimeType: 'image/jpeg', data: base64Data }
          };
        })
      ];

      const payload = {
        contents: [{ parts }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              safety_check: {
                type: "OBJECT",
                properties: {
                  is_safe: { type: "BOOLEAN" },
                  reason: { type: "STRING" }
                },
                required: ["is_safe", "reason"]
              },
              visual_brief_summary: {
                type: "OBJECT",
                properties: {
                  style: { type: "STRING" },
                  palette: { type: "ARRAY", items: { type: "STRING" } },
                  lighting: { type: "STRING" },
                  quality_requirements: { type: "STRING" },
                  target_audience: { type: "STRING" },
                  typography_guideline: { type: "STRING" },
                  product_physical_description: { type: "STRING" },
                },
                required: ["style", "palette", "lighting", "quality_requirements", "target_audience", "typography_guideline", "product_physical_description"],
              },
              image_concepts: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    concept_name: { type: "STRING" },
                    composition_details: { type: "STRING" },
                    elements_and_props: { type: "STRING" },
                    highlighted_features: { type: "STRING" },
                    mood_atmosphere: { type: "STRING" },
                    text_content: {
                      type: "OBJECT",
                      properties: {
                        headline: { type: "STRING" },
                        subline: { type: "STRING" },
                        description: { type: "STRING" },
                      },
                      required: ["headline", "subline", "description"],
                    },
                    rendering_synthesis_prompt: { type: "STRING" },
                  },
                  required: ["concept_name", "composition_details", "elements_and_props", "highlighted_features", "mood_atmosphere", "text_content", "rendering_synthesis_prompt"],
                },
              }
            },
            required: ["safety_check", "visual_brief_summary", "image_concepts"],
          }
        }
      };

      // Try multiple models with fallback logic
      let { data: models, error: modelsError } = await supabaseAdmin
        .from('mode_models')
        .select('model_name')
        .eq('mode', 'analyze')
        .order('priority', { ascending: true });

      if (modelsError || !models || models.length === 0) {
        console.error('Failed to fetch models for analyze mode:', modelsError);
        // Fallback to a default list if the query fails
        models = [{ model_name: 'gemini-2.5-pro' }, { model_name: 'gemini-3-pro-image-preview' }];
      }

      const modelsToTry = models.map(m => m.model_name);
      let result;
      let lastError;

      for (const model of modelsToTry) {
        try {
           result = await callGeminiAPI(model, payload);
           // If we get here, it succeeded
           console.log(`[Model Success] ${model}`);
           break; 
        } catch (e: any) {
           console.warn(`[Model Failed] ${model}: ${e.message}`);
           lastError = e;
           // Continue to next model
        }
      }

      if (!result) {
         // --- REFUND LOGIC: ANALYSIS FAILURE (All Models Failed) ---
          await supabaseAdmin.rpc('add_credits', {
              p_user_id: user.id,
              p_amount: 5, 
              p_reason: 'refund_api_error',
              p_metadata: { error: lastError?.message || 'All analysis models failed' }
          });
         throw lastError || new Error("All AI models failed to respond.");
      }
      
      // Parse response
      const candidate = result.candidates?.[0];
      
      // Check for safety blockage at the API level (before parsing)
      if (candidate?.finishReason === 'SAFETY') {
          // No refund for safety blocks as API was used
          console.warn(`[Safety Block] User: ${user.id}, FinishReason: SAFETY`);
          
          return res.status(400).json({ 
              error: isChineseUI 
                ? "图片包含不安全内容，已被AI模型拦截。" 
                : "Image contains unsafe content and was blocked by the AI model." 
          });
      }

      let textPart = candidate?.content?.parts?.[0]?.text;
      
      if (!textPart) {
          console.error("Gemini Empty Response:", JSON.stringify(result, null, 2));
          
          // --- REFUND LOGIC: ANALYSIS FAILURE (Empty Response) ---
          await supabaseAdmin.rpc('add_credits', {
              p_user_id: user.id,
              p_amount: 5, // Cost of analyze
              p_reason: 'refund_api_error',
              p_metadata: { error: 'Empty response from analysis AI' }
          });
          
          throw new Error("Failed to generate analysis response: Empty response from AI.");
      }
      
      // Clean up markdown code blocks if present
      textPart = textPart.replace(/```json\n?|```/g, '').trim();

      let parsed;
      try {
        parsed = JSON.parse(textPart);
      } catch (e) {
        console.error("JSON Parse Error:", e);
        console.error("Raw Text:", textPart);
        throw new Error("Failed to parse AI response.");
      }

      // 3. Safety Check Verification
      if (parsed.safety_check && parsed.safety_check.is_safe === false) {
          console.warn(`[Safety Check Failed] User: ${user.id}, Reason: ${parsed.safety_check.reason}`);
          
          // Delete unsafe images from storage
          if (data.imagePaths && Array.isArray(data.imagePaths)) {
              await supabaseAdmin.storage.from('temp-uploads').remove(data.imagePaths);
          }

          // No refund for safety check failure as API was used

          return res.status(400).json({ 
              error: isChineseUI 
                ? `安全检测未通过: ${parsed.safety_check.reason}` 
                : `Safety check failed: ${parsed.safety_check.reason}` 
          });
      }

      // Add IDs
      const conceptsWithIds = parsed.image_concepts.map((c: any) => ({
        ...c,
        id: Math.random().toString(36).substring(7),
        // Map new schema fields to frontend expected fields where necessary for compatibility or update frontend
        // Legacy mapping for frontend compatibility:
        title: c.concept_name,
        description: c.text_content.description,
        prompt: c.rendering_synthesis_prompt,
        // Additional metadata
        details: {
          composition: c.composition_details,
          props: c.elements_and_props,
          features: c.highlighted_features,
          mood: c.mood_atmosphere,
          textContent: c.text_content
        }
      }));

      // Map visual_brief_summary to specs
      const specs = {
        style: parsed.visual_brief_summary.style,
        colorPalette: parsed.visual_brief_summary.palette,
        typography: parsed.visual_brief_summary.typography_guideline,
        lighting: parsed.visual_brief_summary.lighting,
        qualityRequirements: parsed.visual_brief_summary.quality_requirements,
        composition: "", // Removed global composition spec as per user request
        targetAudience: parsed.visual_brief_summary.target_audience, 
        productPhysicalDescription: parsed.visual_brief_summary.product_physical_description // New field
      };

      // Log interaction
      logApiInteraction('analyze', payload, result);

      return res.status(200).json({ specs, concepts: conceptsWithIds });
    }

    if (mode === 'generate') {
       // Ensure all frontend params are destructured
       const { concept, specs, dimension, referenceImagePath, referenceImagePaths, language, quantity, clarity, uiLanguage } = data;
       const isChineseUI = uiLanguage === 'Chinese' || uiLanguage === 'zh';

       // Deduct Credits (Atomic RPC)
       // Cost logic: 1 credit per image? For now, just fixed cost per action.
       if (!dryRun) {
         const { error: creditError } = await supabaseAdmin.rpc('consume_credits', {
           p_user_id: user.id,
           p_action_type: 'generate'
         });

         if (creditError) {
            return res.status(402).json({ error: creditError.message || 'Insufficient credits for generation' });
         }
       }

       const fullPrompt = `
        Professional e-commerce photography.
        
        CRITICAL SUBJECT LOCK (Product MUST look exactly like this):
        1) The product MUST match the original image 100%: DO NOT change [structure, orientation, proportions, appearance details, realistic material texture].
        2) DO NOT add non-existent parts/buttons/interfaces/textures/decorations/brand logos; unless they are present in the original product image.
        Product Physical Description: ${specs.productPhysicalDescription || concept.prompt}

        Subject Action/Context: ${concept.prompt}.
        Visual Style: ${specs.style}.
        Lighting: ${specs.lighting}.
        Color System: ${specs.colorPalette.join(', ')}.
        Composition: ${concept.details?.composition || ''}.
        Key Elements: ${concept.details?.props || ''}.
        Atmosphere: ${concept.details?.mood || ''}.
        
        Typography Guide (Strictly adhere to these font styles):
        ${specs.typography}
        
        Text Content to be rendered (Must be legible and clear):
        Headline: ${concept.details?.textContent?.headline || ''}.
        Subline: ${concept.details?.textContent?.subline || ''}.
        Description: ${concept.details?.textContent?.description || ''}.
        Target Language: ${language} (Ensure all generated text follows this language setting. If "No Text" is selected, do not render any text).
        
        ${specs.qualityRequirements}
       `;

       let aspectRatio = "1:1";
       const validRatios = ["1:1", "16:9", "9:16", "4:3", "3:4", "2:3", "3:2", "4:5", "5:4", "21:9"];
       if (validRatios.includes(dimension)) {
           aspectRatio = dimension;
       }

       // Map clarity to imageSize (1K, 2K, 4K)
       let imageSize = clarity || "1K";
       // Validate to ensure it matches API expectations
       if (!["1K", "2K", "4K"].includes(imageSize)) {
           imageSize = "1K";
       }

       const parts: any[] = [{ text: fullPrompt }];
       
       // Process multiple reference images
       const imagePathsToProcess = [];
       if (referenceImagePaths && Array.isArray(referenceImagePaths)) {
           imagePathsToProcess.push(...referenceImagePaths);
       } else if (referenceImagePath) {
           imagePathsToProcess.push(referenceImagePath);
       }

       // Add all valid images to the prompt context
       for (const imgPath of imagePathsToProcess) {
           if (imgPath) {
               try {
                   const base64Data = await downloadAndConvertToBase64(imgPath);
                   parts.push({ inlineData: { mimeType: 'image/jpeg', data: base64Data } });
               } catch (e) {
                   console.error(`Failed to download/convert image: ${imgPath}`, e);
                   // Continue with other images even if one fails
               }
           }
       }

       const payload = {
         contents: [{ parts }],
         generationConfig: {
           responseModalities: ["TEXT", "IMAGE"],
           imageConfig: {
             aspectRatio: aspectRatio,
             imageSize: imageSize
           }
         }
       };

       const quantityInt = quantity || 1;
       const imageUrls: string[] = [];
       
       // Image Generation - Model list with fallback. banana2 is the primary model.
       const { data: models, error: modelsError } = await supabaseAdmin
        .from('mode_models')
        .select('model_name')
        .eq('mode', 'generate')
        .order('priority', { ascending: true });

      if (modelsError || !models || models.length === 0) {
        console.error('Failed to fetch models for generate mode:', modelsError);
        // Fallback to a default list if the query fails
        models = [{ model_name: 'gemini-3.1-flash-image-preview' }, { model_name: 'gemini-3-pro-image-preview' }];
      }

      const modelsToTry = models.map(m => m.model_name);
       let results: any[] = [];
       
       try {
           if (dryRun) {
               console.log(`[Generate] Dry Run mode: Skipping AI model call.`);
               // 1x1 Transparent PNG
               const dummyBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
               for (let i = 0; i < quantityInt; i++) {
                   imageUrls.push(`data:image/png;base64,${dummyBase64}`);
               }
           } else {
           let lastError: any = null;

           for (const model of modelsToTry) {
               // The first model in the list is banana2, the newest and fastest.
               console.log(`[Generate] Attempting model: ${model}`);
               try {
                   // Parallel execution for quantity > 1
                   const promises = Array(quantityInt).fill(null).map(() => callGeminiAPI(model, payload));
                   
                   results = await Promise.allSettled(promises);
                   let failedCount = 0;

                   // Check if we got valid images
                   for (const res of results) {
                       if (res.status === 'fulfilled') {
                           const result = res.value;
                           let gotImage = false;
                           if (result.candidates) {
                               for (const candidate of result.candidates) {
                                   if (candidate.content?.parts) {
                                       for (const part of candidate.content.parts) {
                                           if (part.inlineData) {
                                               imageUrls.push(`data:image/png;base64,${part.inlineData.data}`);
                                               gotImage = true;
                                           }
                                       }
                                   }
                               }
                           }
                           if (!gotImage) {
                               failedCount++;
                               lastError = new Error("API returned success but no image");
                           }
                           logApiInteraction('generate', payload, result);
                       } else {
                           failedCount++;
                           lastError = res.reason;
                           console.warn(`[Generate] Individual request failed with model ${model}: ${res.reason?.message}`);
                       }
                   }

                   // Handle partial refunds for this attempt
                   if (failedCount > 0 && failedCount < quantityInt) {
                       const refundAmount = 5 * failedCount;
                       console.warn(`[Refund] Processing PARTIAL refund of ${refundAmount} credits for user ${user.id} (Failed: ${failedCount}/${quantityInt})`);
                       await supabaseAdmin.rpc('add_credits', {
                          p_user_id: user.id,
                          p_amount: refundAmount,
                          p_reason: 'refund_api_error',
                          p_metadata: { error: lastError?.message || 'Partial failure', model: model, failed_count: failedCount, total: quantityInt }
                       });
                   }

                   // If we got any images, we can break out of the model-fallback loop
                   if (imageUrls.length > 0) {
                       console.log(`[Generate] Success with model: ${model}. Generated ${imageUrls.length} images.`);
                       break;
                   } else {
                       console.warn(`[Generate] Model ${model} failed to produce any images. Trying next model...`);
                       // lastError is already set from the inner loop
                   }

               } catch (e: any) {
                   console.error(`[Generate] Critical failure with model ${model}: ${e.message}`);
                   lastError = e;
                   // Continue to the next model in the list
               }
           }

           // After trying all models, if we still have no images, handle the final error
           if (imageUrls.length === 0) {
               console.error(`[Generate] All models failed. Last error: ${lastError?.message}`);
               
               // If all failed, we want to return a 503 if it was a connection error, to trigger the nice message
               const isRefundableError = lastError?.message && (
                    lastError.message.includes('ECONNRESET') || 
                    lastError.message.includes('socket hang up') || 
                    lastError.message.includes('timeout') ||
                    lastError.message.includes('fetch failed') ||
                    lastError.message.includes('Generation failed') ||
                    lastError.message.includes('No images returned')
               );

               // Since all attempts failed, process a full refund
               const refundAmount = 5 * quantityInt;
               console.warn(`[Refund] Processing FULL refund of ${refundAmount} credits for user ${user.id} (Failed: ${quantityInt}/${quantityInt})`);
               await supabaseAdmin.rpc('add_credits', {
                  p_user_id: user.id,
                  p_amount: refundAmount,
                  p_reason: 'refund_api_error',
                  p_metadata: { error: lastError?.message || 'All models failed', failed_count: quantityInt, total: quantityInt }
               });

               if (isRefundableError) {
                   const userMsg = isChineseUI 
                      ? "当前云端算力需求激增，AI 引擎正在全力运转。为确保最佳生成效果，请您稍候片刻再次尝试，感谢您的耐心等待。" 
                      : "Our AI engines are currently experiencing exceptionally high demand. To ensure the best quality, please try your request again in a few moments.";
                   
                   return res.status(503).json({ error: userMsg });
               }
               
               throw lastError || new Error(`All models failed to generate images.`);
           }
           }

       } catch (e: any) {
           console.error(`[Generate] Model ${model} failed: ${e.message}`);
           throw e;
       }
       
       // Process Generated Images: Upload to Storage & Save to DB
       const finalImageUrls: string[] = [];
       const storagePaths: string[] = [];

       // 1. Create Generation Record
       const { data: genData, error: genError } = await supabaseAdmin.from('generations').insert({
           user_id: user.id,
           type: 'generate',
           status: imageUrls.length > 0 ? 'completed' : 'failed',
           prompt: concept,
           full_prompt: fullPrompt,
           parameters: { 
             specs, 
             dimension, 
             quantity,
             conceptName: concept.title || concept.concept_name // Store concept name for UI display
           },
           error_message: imageUrls.length === 0 ? 'No images returned from AI' : null
       }).select().single();

       if (genData && imageUrls.length > 0) {
           // 1. Immediately respond to the client with Base64 data for an optimistic UI.
           res.status(200).json({ 
               isProcessing: true,
               temporaryImageUrls: imageUrls,
               generationId: genData.id
           });

           // 2. Asynchronously process images in the background.
           // This part runs *after* the response has been sent.
           const host = req.headers.host;
           if (!host) {
               console.error('[Generate] Critical: req.headers.host is missing. Cannot trigger background image processing.');
               return; // Exit cleanly. Images are sent to user, but not saved.
           }

           const protocol = host.startsWith('localhost') ? 'http' : 'https';
           const domain = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `${protocol}://${host}`;
           const url = `${domain}/api/process-image`;
           
           console.log(`[Generate] Triggering background process for ${imageUrls.length} images to ${url}`);

           // Fire-and-forget fetch calls for each image.
           imageUrls.forEach(base64 => {
               fetch(url, {
                   method: 'POST',
                   headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                   },
                   body: JSON.stringify({
                       userId: user.id,
                       base64: base64,
                       generationId: genData.id,
                       dimension: dimension,
                       conceptName: concept.title || concept.concept_name
                   })
               }).catch(err => {
                   console.error(`[Generate] Background process trigger failed:`, err.message);
               });
           });

           // 3. Return to stop any further execution in this function.
           return;
       } else {
           console.error("Failed to insert generation record:", genError);
           // If there are no images but we failed to record the generation, throw an error
           if (!genError) {
             throw new Error("Generation failed and no images were produced.");
           }
       }

       // Fallback if storage upload failed for all
       if (finalImageUrls.length === 0 && imageUrls.length > 0) {
           finalImageUrls.push(...imageUrls); 
       }

       let imageUrl = finalImageUrls[0] || '';
        
       if (!imageUrl) {
           console.warn("No image returned", results);
           return res.status(500).json({ error: 'No image returned from AI model' });
      }

      return res.status(200).json({ imageUrl, imageUrls: finalImageUrls, assets: [] });
    }

    if (mode === 'edit') {
        const { imageBase64, prompt, generationId, originalAssetId } = data;
        
        // 1. Get Cost (for potential refund)
        const { data: rule } = await supabaseAdmin
            .from('credit_rules')
            .select('cost')
            .eq('action_type', 'edit')
            .single();
        const editCost = rule?.cost || 5;

        // 2. Deduct Credits (Atomic RPC)
        const { error: creditError } = await supabaseAdmin.rpc('consume_credits', {
          p_user_id: user.id,
          p_action_type: 'edit'
        });

        if (creditError) {
            return res.status(402).json({ error: creditError.message || 'Insufficient credits for editing' });
        }

        try {
            const payload = {
                contents: [{
                    parts: [
                        { inlineData: { mimeType: "image/png", data: imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64 } },
                        { text: prompt }
                    ]
                }]
            };

            const { data: models, error: modelsError } = await supabaseAdmin
                .from('mode_models')
                .select('model_name')
                .eq('mode', 'edit')
                .order('priority', { ascending: true });

            if (modelsError || !models || models.length === 0) {
                console.error('Failed to fetch models for edit mode:', modelsError);
                // Fallback to a default list if the query fails
                models = [{ model_name: 'gemini-3.1-flash-image-preview' }, { model_name: 'gemini-3-pro-image-preview' }];
            }

            const modelsToTry = models.map(m => m.model_name);
            let result: any = null;
            let lastError: any = null;
            let imageUrl = '';

            for (const model of modelsToTry) {
                try {
                    console.log(`[Edit] Attempting model: ${model}`);
                    result = await callGeminiAPI(model, payload);
                    
                    const candidate = result.candidates?.[0];
                    if (candidate?.content?.parts) {
                        for (const part of candidate.content.parts) {
                            if (part.inlineData) {
                                imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                                break;
                            }
                        }
                    }

                    if (imageUrl) {
                        console.log(`[Edit] Success with model: ${model}`);
                        logApiInteraction('edit', payload, result); // Log successful interaction
                        break; // Exit loop on success
                    }

                    // If API returns success but no image, it's a failure for this model
                    lastError = new Error(`Model ${model} returned success but no image data.`);
                    console.warn(`[Edit] ${lastError.message}`);

                } catch (e: any) {
                    lastError = e;
                    console.warn(`[Edit] Model ${model} failed: ${e.message}`);
                    // Continue to the next model
                }
            }
            
            if (!imageUrl) {
                throw lastError || new Error("All models failed to edit the image.");
            }

            // Save edited image to storage and DB
            const storagePath = await uploadToStorage(user.id, imageUrl);
            const signedUrl = await getSignedUrl('generated-images', storagePath);

            const { data: assetData } = await supabaseAdmin.from('assets').insert({
                user_id: user.id,
                generation_id: generationId || null,
                storage_path: storagePath,
                public_url: signedUrl,
                asset_type: 'image',
                metadata: {
                    type: 'edit',
                    prompt: prompt,
                    parent_asset_id: originalAssetId
                }
            }).select().single();

            // Log interaction
            logApiInteraction('edit', payload, result);

            return res.status(200).json({ 
                imageUrl: signedUrl,
                asset: assetData ? {
                    id: assetData.id,
                    imageUrl: signedUrl,
                    generationId: assetData.generation_id,
                    parentAssetId: originalAssetId
                } : undefined
            });

        } catch (err: any) {
            console.error("Edit API Error:", err);
            
            // Refund on failure
            await supabaseAdmin.rpc('add_credits', {
                p_user_id: user.id,
                p_amount: editCost,
                p_reason: 'refund_api_error',
                p_metadata: { error: err.message, mode: 'edit' }
            });

            return res.status(500).json({ error: err.message || 'Failed to edit image' });
        }
    }

  } catch (err: any) {
    console.error("API Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
