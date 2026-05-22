import type { DesignBrief, ImageConcept, DesignSpecs, OutputLanguage } from '../types';
import { supabase } from '../supabaseClient';

const getAuthHeaders = async () => {
  if (!supabase) return {};
  const { data: { session } } = await supabase.auth.getSession();
  return session ? { 'Authorization': `Bearer ${session.access_token}` } : {};
};

export const analyzeProductContext = async (
  imagePaths: string[],
  requirements: string,
  language: OutputLanguage,
  batchCount: number,
  uiLanguage: string = 'English'
): Promise<DesignBrief> => {
  const headers = await getAuthHeaders();
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers } as HeadersInit,
    body: JSON.stringify({
      mode: 'analyze',
      data: { imagePaths, requirements, language, batchCount, uiLanguage },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('API Error Response:', errorData);
    
    // Check for 503 Service Unavailable or specific "busy" messages
    if (response.status === 503 || (errorData.error && (
        errorData.error.includes('demand') || 
        errorData.error.includes('capacity') ||
        errorData.error.includes('overloaded') ||
        errorData.error.includes('wait')
    ))) {
         const userMsg = uiLanguage === 'Chinese' 
            ? "当前云端算力需求激增，AI 引擎正在全力运转。为确保最佳生成效果，请您稍候片刻再次尝试，感谢您的耐心等待。" 
            : "Our AI engines are currently experiencing exceptionally high demand. To ensure the best quality, please try your request again in a few moments.";
         throw new Error(userMsg);
    }

    // Check for Insufficient Credits
    if (response.status === 402 || (errorData.error && errorData.error.includes('Insufficient credits'))) {
        const required = errorData.error?.match(/Required: (\d+)/)?.[1] || '?';
        const available = errorData.error?.match(/Available: (\d+)/)?.[1] || '0';
        
        const msg = uiLanguage === 'Chinese' 
          ? `积分不足。需要: ${required}, 可用: ${available} (Insufficient credits)`
          : `Insufficient credits. Required: ${required}, Available: ${available}`;
        throw new Error(msg);
    }

    const errorMessage = errorData.error || (uiLanguage === 'Chinese' ? '分析失败，请稍后重试' : 'Analysis failed, please try again later');
    throw new Error(errorMessage);
  }

  return response.json();
};

export const generateMarketingImage = async (
  concept: ImageConcept,
  specs: DesignSpecs,
  dimension: string,
  clarity: string,
  quantity: number,
  referenceImagePaths?: string[]
): Promise<{ imageUrl: string, assets: any[], temporaryImageUrls?: string[], generationId?: string }> => {
  const headers = await getAuthHeaders();
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers } as HeadersInit,
    body: JSON.stringify({
      mode: 'generate',
      data: { concept, specs, dimension, clarity, quantity, referenceImagePaths },
    }),
  });

  if (!response.ok) {
     if (response.status === 402) throw new Error('Insufficient credits');
     throw new Error('Generation failed');
  }

  const result = await response.json();
  return result;
};

export const editGeneratedImage = async (
  imageBase64: string,
  prompt: string,
  generationId?: string,
  originalAssetId?: string
): Promise<{ imageUrl: string, asset?: any }> => {
  const headers = await getAuthHeaders();
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers } as HeadersInit,
    body: JSON.stringify({
      mode: 'edit',
      data: { imageBase64, prompt, generationId, originalAssetId },
    }),
  });

  if (!response.ok) {
    if (response.status === 402) throw new Error('Insufficient credits');
    throw new Error('Edit failed');
  }

  const result = await response.json();
  return result;
};
