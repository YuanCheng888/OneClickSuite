import { APP_NAME } from "./constants";
export type APP_NAME = typeof APP_NAME;

export const AppStep = {
  UPLOAD: 'UPLOAD',
  ANALYZING: 'ANALYZING',
  PLANNING: 'PLANNING',
  GENERATION: 'GENERATION',
  COMPLETE: 'COMPLETE',
} as const;

export type AppStep = typeof AppStep[keyof typeof AppStep];

export type AppLanguage = 'English' | 'Chinese';

export type OutputLanguage = 
  | 'No Text'
  | 'English' 
  | 'Chinese'
  | 'Chinese (Simplified)'
  | 'Chinese (Traditional)'
  | 'Japanese' 
  | 'Korean'
  | 'German'
  | 'French'
  | 'Spanish'
  | 'Italian'
  | 'Russian'
  | 'Portuguese'
  | 'Dutch'
  | 'Arabic'
  | 'Hindi'
  | 'Turkish'
  | 'Vietnamese'
  | 'Thai'
  | 'Indonesian'
  | 'Malay'
  | 'Polish'
  | 'Swedish';

export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  base64?: string; // Kept for backward compatibility but optional now
  storagePath?: string; // Path in Supabase Storage (e.g. "user_id/filename.png")
  status?: 'uploading' | 'done' | 'error';
}

export interface ImageConcept {
  id: string;
  title: string;
  description: string;
  prompt: string;
  // New extended fields (optional for backward compatibility if needed, but we should populate them)
  details?: {
    composition: string;
    props: string;
    features: string;
    mood: string;
    textContent: {
      headline: string;
      subline: string;
      description: string;
    }
  }
}

export interface DesignSpecs {
  style: string;
  colorPalette: string[];
  typography: string;
  lighting: string;
  composition: string;
  targetAudience: string;
  qualityRequirements: string;
  productPhysicalDescription: string;
}

export interface DesignBrief {
  specs: DesignSpecs;
  concepts: ImageConcept[];
}

export interface GeneratedAsset {
  id: string;
  conceptId: string;
  imageUrl: string;
  status: 'loading' | 'success' | 'error';
  generationId?: string;
  parentAssetId?: string; // For edit history
}

export interface ProjectState {
  images: UploadedImage[];
  requirements: string;
  language: OutputLanguage;
  dimension: '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '2:3' | '3:2' | '4:5' | '5:4' | '21:9';
  clarity: '1K' | '2K' | '4K';
  batchCount: number;
  brief: DesignBrief | null;
  assets: GeneratedAsset[];
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  credits: number;
  tier?: string;
  subscription_tier?: string; // Legacy support
  stripe_customer_id?: string;
  creem_customer_id?: string;
  creem_subscription_id?: string;
  cancel_at_period_end?: boolean;
  period_end?: string;
  app_language?: AppLanguage;
  created_at?: string;
}

export interface CreditLog {
  id: string;
  user_id: string;
  action_type: string;
  change_amount: number;
  balance_after: number;
  metadata: Record<string, unknown>;
  created_at: string;
}
