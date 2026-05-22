export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

export const generateId = () => Math.random().toString(36).substring(2, 9);

export const formatDateForFilename = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
};

import { APP_NAME } from './constants';

export const generateDownloadFilename = (id: string, date?: string | Date): string => {
  const d = date ? new Date(date) : new Date();
  const dateStr = formatDateForFilename(d.toISOString());
  const appNameSlug = APP_NAME.toLowerCase().replace(/\s+/g, '-');
  return `${appNameSlug}-${dateStr}-${id}.png`;
};
