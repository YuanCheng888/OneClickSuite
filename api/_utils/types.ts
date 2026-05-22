export enum AppStep {
  UPLOAD = 'UPLOAD',
  PLANNING = 'PLANNING',
  GENERATION = 'GENERATION',
}

export type AppLanguage = 'English' | 'Russian' | 'Japanese' | 'Chinese';

export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  base64: string;
}

export interface ImageConcept {
  id: string;
  title: string;
  description: string;
  prompt: string;
}

export interface DesignSpecs {
  style: string;          // Maps to Visual Language
  colorPalette: string[]; // Maps to Color System
  typography: string;     // Maps to Font System
  lighting: string;
  composition: string;
  targetAudience: string;
}

export interface DesignBrief {
  specs: DesignSpecs;
  concepts: ImageConcept[];
}
