import { supabaseAdmin } from '../_utils/supabase.js';

export default async function handler(req: any, res: any) {
  // Only allow GET requests (standard for Cron jobs usually, though POST works too)
  // Vercel Cron sends GET requests by default
  
  try {
    console.log('Starting cleanup of temp-uploads...');
    const bucketName = 'temp-uploads';
    // Clean up files older than 24 hours
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); 
    
    // 1. List root folders (users)
    const { data: folders, error: listError } = await supabaseAdmin.storage
      .from(bucketName)
      .list();

    if (listError) throw listError;
    if (!folders || folders.length === 0) {
      return res.status(200).json({ message: 'No folders to cleanup' });
    }

    let deletedCount = 0;
    const errors: any[] = [];

    // Iterate through user folders
    for (const folder of folders) {
        // Skip placeholders or system files if any
        if (folder.name === '.emptyFolderPlaceholder') continue;

        // List files in folder
        const { data: files, error: filesError } = await supabaseAdmin.storage
            .from(bucketName)
            .list(folder.name);

        if (filesError) {
            console.error(`Error listing folder ${folder.name}:`, filesError);
            errors.push({ folder: folder.name, error: filesError });
            continue;
        }

        const filesToDelete: string[] = [];
        
        for (const file of files || []) {
            if (file.name === '.emptyFolderPlaceholder') continue;
            // Ensure created_at exists
            if (!file.created_at) continue;

            const createdAt = new Date(file.created_at);
            if (createdAt < cutoffTime) {
                filesToDelete.push(`${folder.name}/${file.name}`);
            }
        }

        if (filesToDelete.length > 0) {
            const { error: deleteError } = await supabaseAdmin.storage
                .from(bucketName)
                .remove(filesToDelete);

            if (deleteError) {
                console.error(`Error deleting files in ${folder.name}:`, deleteError);
                errors.push({ folder: folder.name, error: deleteError });
            } else {
                deletedCount += filesToDelete.length;
                console.log(`Deleted ${filesToDelete.length} files from ${folder.name}`);
            }
        }
    }
    
    return res.status(200).json({ 
        message: 'Cleanup completed', 
        deletedCount, 
        timestamp: new Date().toISOString(),
        errors: errors.length > 0 ? errors : undefined
    });
  } catch (err: any) {
    console.error('Cleanup error:', err);
    return res.status(500).json({ error: err.message });
  }
}
