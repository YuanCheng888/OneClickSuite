import { createCreem } from 'creem_io';

const apiKey = process.env.CREEM_API_KEY || '';

// Singleton Creem instance
export const creem = createCreem({
  apiKey,
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET, // Optional for checkout, required for webhook
  testMode: apiKey.startsWith('creem_test_') || process.env.NODE_ENV !== 'production',
});
