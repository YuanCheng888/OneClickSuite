import { supabaseAdmin } from './supabase.js';

// Helper to download image from Supabase Storage and convert to Base64
export async function downloadAndConvertToBase64(path: string, bucket: string = 'temp-uploads'): Promise<string> {
  // path is like "user_id/filename.ext"
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .download(path);
  
  if (error || !data) {
    throw new Error(`Failed to download image from storage: ${path}. Error: ${error?.message}`);
  }
  
  const arrayBuffer = await data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString('base64');
}
