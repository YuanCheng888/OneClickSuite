import { supabaseAdmin } from './_utils/supabase.js';
import { Buffer } from 'buffer';

/**
 * 上传 Base64 图片到 Supabase Storage
 * @param userId - 用户ID，用于创建存储路径
 * @param base64Data - Base64 编码的图片数据
 * @param folder - 存储桶名称，默认为 'generated-images'
 * @returns 存储路径字符串
 */
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

/**
 * 获取 Supabase Storage 中的签名 URL
 * @param bucket - 存储桶名称
 * @param path - 文件存储路径
 * @returns 签名 URL 字符串，失败返回空字符串
 */
async function getSignedUrl(bucket: string, path: string): Promise<string> {
    const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .createSignedUrl(path, 60 * 60 * 24 * 365);
    
    if (error || !data) return '';
    return data.signedUrl;
}

/**
 * 后台图片处理 API：将生成的 Base64 图片上传到 Supabase Storage 并记录到数据库
 * 需要身份验证：Bearer Token + userId 一致性校验
 */
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, base64, generationId, dimension, conceptName } = req.body;

    if (!userId || !base64 || !generationId) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    // 身份验证：验证请求者身份并确保 userId 一致
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid authorization header' });
    }
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (user.id !== userId) {
      return res.status(403).json({ error: 'User ID mismatch' });
    }

    console.log(`[Process-Image] Started for user: ${userId}, generation: ${generationId}`);

    const storagePath = await uploadToStorage(userId, base64);
    const signedUrl = await getSignedUrl('generated-images', storagePath);

    await supabaseAdmin.from('assets').insert({
        user_id: userId,
        generation_id: generationId,
        storage_path: storagePath,
        public_url: signedUrl, 
        asset_type: 'image',
        metadata: { 
            dimension,
            conceptName
        }
    });

    console.log(`[Process-Image] Completed for user: ${userId}, generation: ${generationId}`);

    return res.status(200).json({ success: true, signedUrl });
  } catch (e: any) {
      console.error('[Process-Image] Error:', e.message);
      return res.status(500).json({ success: false, error: 'Image processing failed' });
  }
}
