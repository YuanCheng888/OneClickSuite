import React, { useRef, useState, useEffect } from 'react';
import { 
  Plus, Minus, Trash2, Edit3, Image as ImageIcon, Globe, ListOrdered, Sparkles, Loader2,
  ChevronDown, Check, Maximize2, Edit2, X, Download, AlertTriangle, LogIn
} from 'lucide-react';
import type { ProjectState, UploadedImage, AppLanguage, User, OutputLanguage } from '../types';
import { fileToBase64, generateDownloadFilename, generateId } from '../utils';
import { editGeneratedImage } from '../services/api';
import { translations } from '../translations';
import { supabase } from '../supabaseClient';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  variant = 'danger'
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  variant?: 'danger' | 'primary';
}) => {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';
  const Icon = isDanger ? AlertTriangle : LogIn;
  const iconClass = isDanger 
    ? "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400"
    : "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400";
    
  const btnClass = isDanger
    ? "bg-red-500 hover:bg-red-600 shadow-red-500/20"
    : "bg-primary-600 hover:bg-primary-700 shadow-primary-500/20";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-[320px] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-200">
        <div className="p-5 text-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 ${iconClass}`}>
             <Icon size={20} />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed px-2">
            {description}
          </p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-900/50 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-bold text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2 px-3 text-white rounded-lg font-bold text-xs transition-colors shadow-lg ${btnClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const MAX_IMAGES = 9;

const OUTPUT_LANGUAGES: { value: OutputLanguage; labelEn: string; labelZh: string }[] = [
  { value: 'No Text', labelEn: 'No Text (Visual Only)', labelZh: '无文字（纯视觉）' },
  { value: 'English', labelEn: 'English', labelZh: '英语' },
  { value: 'Chinese (Simplified)', labelEn: 'Chinese (Simplified)', labelZh: '中文（简体）' },
  { value: 'Chinese (Traditional)', labelEn: 'Chinese (Traditional)', labelZh: '中文（繁体）' },
  { value: 'Japanese', labelEn: 'Japanese', labelZh: '日语' },
  { value: 'Korean', labelEn: 'Korean', labelZh: '韩语' },
  { value: 'German', labelEn: 'German', labelZh: '德语' },
  { value: 'French', labelEn: 'French', labelZh: '法语' },
  { value: 'Spanish', labelEn: 'Spanish', labelZh: '西班牙语' },
  { value: 'Italian', labelEn: 'Italian', labelZh: '意大利语' },
  { value: 'Russian', labelEn: 'Russian', labelZh: '俄语' },
  { value: 'Portuguese', labelEn: 'Portuguese', labelZh: '葡萄牙语' },
  { value: 'Dutch', labelEn: 'Dutch', labelZh: '荷兰语' },
  { value: 'Arabic', labelEn: 'Arabic', labelZh: '阿拉伯语' },
  { value: 'Hindi', labelEn: 'Hindi', labelZh: '印地语' },
  { value: 'Turkish', labelEn: 'Turkish', labelZh: '土耳其语' },
  { value: 'Vietnamese', labelEn: 'Vietnamese', labelZh: '越南语' },
  { value: 'Thai', labelEn: 'Thai', labelZh: '泰语' },
  { value: 'Indonesian', labelEn: 'Indonesian', labelZh: '印尼语' },
  { value: 'Malay', labelEn: 'Malay', labelZh: '马来语' },
  { value: 'Polish', labelEn: 'Polish', labelZh: '波兰语' },
  { value: 'Swedish', labelEn: 'Swedish', labelZh: '瑞典语' },
];

interface ProjectInputPanelProps {
  state: ProjectState;
  onUpdate: (updates: Partial<ProjectState>) => void;
  user: User | null;
  appLanguage: AppLanguage;
  profile: any;
  onGoPricing: () => void;
  loading: boolean;
  /** Optional action button to render at the bottom of the panel */
  actionButton?: React.ReactNode;
  /** Whether the inputs should be read-only (e.g. after analysis started) */
  readOnly?: boolean;
  onLogin?: () => void;
}

const ProjectInputPanel: React.FC<ProjectInputPanelProps> = ({
  state,
  onUpdate,
  user,
  appLanguage,
  profile,
  onGoPricing,
  loading,
  actionButton,
  readOnly = false,
  onLogin
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isReadingFiles, setIsReadingFiles] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isRatioOpen, setIsRatioOpen] = useState(false);
  const [isResOpen, setIsResOpen] = useState(false);
  const t = translations[appLanguage].studio;
  
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [costs, setCosts] = useState<{ generate: number; edit: number } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showLoginConfirm, setShowLoginConfirm] = useState(false);

  // Track latest images state to handle updates during async operations
  const imagesRef = useRef(state.images);
  useEffect(() => {
    imagesRef.current = state.images;
  }, [state.images]);

  useEffect(() => {
    const fetchCosts = async () => {
      if (!supabase) return;
      const { data } = await supabase
        .from('credit_rules')
        .select('action_type, cost')
        .in('action_type', ['generate', 'edit']);
      
      if (data) {
        const costMap = data.reduce((acc, curr) => ({
          ...acc,
          [curr.action_type]: curr.cost
        }), { generate: 0, edit: 0 });
        setCosts(costMap);
      }
    };
    fetchCosts();
  }, []);

  const handleEdit = async () => {
    if (!selectedImage || !editPrompt) return;
    setEditLoading(true);
    try {
        let imageBase64 = selectedImage.base64;
        
        // Lazy load base64 if missing (optimization: we removed eager conversion in upload)
        if (!imageBase64) {
             if (selectedImage.file) {
                 imageBase64 = await fileToBase64(selectedImage.file);
             } else if (selectedImage.previewUrl) {
                 // Fallback: fetch from blob/url
                 const res = await fetch(selectedImage.previewUrl);
                 const blob = await res.blob();
                 // Create a temp file to reuse the utility
                 const file = new File([blob], "temp.png", { type: blob.type });
                 imageBase64 = await fileToBase64(file);
             }
        }
        
        if (!imageBase64) throw new Error("Could not process image");

        const { imageUrl: newImageBase64 } = await editGeneratedImage(imageBase64, editPrompt);
        
        // Convert base64 to Blob/File for upload
        const response = await fetch(newImageBase64);
        const blob = await response.blob();
        const file = new File([blob], "edited_image.png", { type: "image/png" });
        
        // Upload to Supabase
        if (!user) throw new Error("User not found");
        if (!supabase) throw new Error("Supabase client not initialized");
        const fileName = `${Date.now()}_edited_${Math.random().toString(36).substring(7)}.png`;
        const filePath = `${user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('temp-uploads')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const newImage: UploadedImage = {
            ...selectedImage,
            file: file,
            previewUrl: URL.createObjectURL(file),
            base64: newImageBase64,
            storagePath: filePath,
        };

        const newImages = state.images.map(img => img.id === selectedImage.id ? newImage : img);
        onUpdate({ images: newImages });
        setSelectedImage(newImage);
        setEditPrompt('');
        setIsEditing(false);
    } catch (e: any) {
        console.error(e);
        alert((translations[appLanguage] as any).results?.editFailed || "Edit failed");
    } finally {
        setEditLoading(false);
    }
  };

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(imageUrl, '_blank');
    }
  };

  const getSortedLanguages = () => {
    const isChineseUI = appLanguage === 'Chinese';
    
    if (isChineseUI) {
      // Order: No Text, Simplified, Traditional, English, then others
      const priority = ['No Text', 'Chinese (Simplified)', 'Chinese (Traditional)', 'English'];
      return [
        ...OUTPUT_LANGUAGES.filter(l => priority.includes(l.value)).sort((a, b) => priority.indexOf(a.value) - priority.indexOf(b.value)),
        ...OUTPUT_LANGUAGES.filter(l => !priority.includes(l.value))
      ];
    } else {
      // Order: No Text, English, Simplified, Traditional, then others
      const priority = ['No Text', 'English', 'Chinese (Simplified)', 'Chinese (Traditional)'];
      return [
        ...OUTPUT_LANGUAGES.filter(l => priority.includes(l.value)).sort((a, b) => priority.indexOf(a.value) - priority.indexOf(b.value)),
        ...OUTPUT_LANGUAGES.filter(l => !priority.includes(l.value))
      ];
    }
  };

  const sortedLanguages = getSortedLanguages();

  const processFiles = async (files: File[]) => {
    if (!user) {
      alert(t.alertLogin);
      return;
    }
    
    const availableSlots = MAX_IMAGES - state.images.length;
    if (availableSlots <= 0) {
      alert(t.alertMaxImages(MAX_IMAGES));
      return;
    }

    setIsReadingFiles(true);
    const filesToProcess = files.slice(0, availableSlots);
    
    // 1. Optimistic UI: Create local previews immediately
    const optimisticImages: UploadedImage[] = filesToProcess.map(file => ({
      id: generateId(),
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'uploading'
    }));

    // Add to state immediately
    onUpdate({ images: [...state.images, ...optimisticImages] });

    try {
      if (!supabase) throw new Error("Supabase client not initialized");

      // 2. Parallel Uploads
      const uploadPromises = optimisticImages.map(async (img) => {
        if (!supabase) throw new Error("Supabase client not initialized");
        try {
          const fileExt = img.file.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('temp-uploads')
            .upload(filePath, img.file);

          if (uploadError) throw uploadError;

          return { ...img, storagePath: filePath, status: 'done' as const };
        } catch (error) {
          console.error(`Upload failed for ${img.file.name}:`, error);
          return { ...img, status: 'error' as const };
        }
      });

      const uploadedImages = await Promise.all(uploadPromises);

      // 3. Update state with final results
      // Use the latest state from ref to avoid reverting deletions that happened during upload
      const currentImages = imagesRef.current;
      const finalImages = currentImages.map(currentImg => {
         // If this image was just uploaded, replace it with the result (containing storagePath)
         const updated = uploadedImages.find(u => u.id === currentImg.id);
         return updated || currentImg;
      });
      
      onUpdate({ images: finalImages });

    } catch (err) {
      console.error('Batch upload error', err);
    } finally {
      setIsReadingFiles(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(Array.from(e.target.files));
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
       const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
       if (files.length > 0) {
          await processFiles(files);
       }
    }
  };

  const removeImage = (id: string) => {
    onUpdate({ images: state.images.filter(img => img.id !== id) });
  };

  return (
    <div className="flex flex-col gap-6">
      <ConfirmationModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => {
          onUpdate({ images: [] });
          setShowClearConfirm(false);
        }}
        title={(t as any).clearAllTitle || 'Clear All Assets?'}
        description={(t as any).clearAllDesc || 'This action will remove all uploaded images. This cannot be undone.'}
        confirmText={(t as any).confirmClearBtn || 'Clear All'}
        cancelText={(t as any).cancelClearBtn || 'Cancel'}
      />

      <ConfirmationModal
        isOpen={showLoginConfirm}
        onClose={() => setShowLoginConfirm(false)}
        onConfirm={() => {
          setShowLoginConfirm(false);
          onLogin?.();
        }}
        title={(t as any).loginRequired || 'Login Required'}
        description={(t as any).loginDesc || 'Please sign in.'}
        confirmText={(t as any).loginBtn || 'Sign In'}
        cancelText={(t as any).cancelClearBtn || 'Cancel'}
        variant="primary"
      />

      {/* Assets Card */}
      <div className="bg-gradient-to-b from-white/95 to-white/90 dark:from-slate-900/95 dark:to-slate-900/90 backdrop-blur-xl rounded-[32px] border border-white/40 dark:border-white/10 p-8 shadow-xl shadow-indigo-500/5 overflow-hidden flex flex-col min-h-[320px]">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/80 to-white/20 dark:from-white/10 dark:to-white/5 backdrop-blur-md flex items-center justify-center text-primary-600 dark:text-primary-400 border border-white/40 dark:border-white/10 shadow-lg shadow-primary-500/10">
            <ImageIcon size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1.5">{t.assets}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
              <span>Upload product images</span>
              <span className="bg-white/50 dark:bg-white/10 px-2 py-0.5 rounded-full text-2xs font-bold text-foreground-muted dark:text-gray-300 border border-white/20">{state.images.length}/9</span>
            </p>
          </div>
          
          {state.images.length > 0 && !readOnly && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowClearConfirm(true);
              }}
              className="ml-auto p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
              title={(t as any).clearAll || 'Clear All'}
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>

        <div className={`flex-1 grid grid-cols-3 gap-3 ${state.images.length === 0 ? 'items-center justify-center border-2 border-dashed border-gray-300/50 dark:border-gray-700/50 rounded-2xl p-8 bg-gray-50/30 dark:bg-gray-900/30' : ''}`}>
            <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            
            {state.images.map((img, idx) => (
              <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden border border-white/40 dark:border-white/10 group shadow-sm">
                <img src={img.previewUrl} className={`w-full h-full object-cover transition-opacity ${img.status === 'uploading' ? 'opacity-50' : ''}`} alt="Thumb" />
                
                {/* Loading / Error States */}
                {img.status === 'uploading' && (
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-10">
                    <Loader2 size={24} className="text-white animate-spin drop-shadow-md" />
                  </div>
                )}
                {img.status === 'error' && (
                   <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center z-10">
                      <span className="text-white text-xs font-bold bg-red-500/90 px-2 py-1 rounded shadow-sm">Error</span>
                   </div>
                )}

                <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2 backdrop-blur-[2px] ${img.status === 'uploading' ? 'hidden' : ''}`}>
                   <button 
                      onClick={() => setSelectedImage(img)}
                      className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-xl text-white transition-colors border border-white/20"
                      title="Zoom/Edit"
                   >
                      <Maximize2 size={16} />
                   </button>
                  <button onClick={() => removeImage(img.id)} className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-xl transition-colors border border-red-400/30">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-sm text-white text-3xs px-2 py-0.5 rounded-lg font-bold border border-white/10">{idx + 1}</div>
              </div>
            ))}

            {state.images.length < MAX_IMAGES && (
              <button 
                onClick={() => {
                  if (!user) {
                    if (onLogin) {
                      setShowLoginConfirm(true);
                    } else {
                      alert(t.alertLogin);
                    }
                    return;
                  }
                  fileInputRef.current?.click();
                }} 
                disabled={isReadingFiles}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`aspect-square border-2 border-dashed rounded-2xl flex items-center justify-center transition-all duration-300 disabled:opacity-50 group ${
                  isDragging 
                    ? 'border-primary-500 bg-primary-500/10 text-primary-500 scale-105 shadow-xl shadow-primary-500/20' 
                    : 'border-gray-300/50 dark:border-gray-700/50 text-gray-400 hover:text-primary-500 hover:border-primary-500/50 hover:bg-primary-500/5 hover:shadow-lg hover:shadow-primary-500/5'
                }`}
              >
                {isReadingFiles ? <Loader2 size={24} className="animate-spin text-primary-500" /> : <Plus size={24} className="group-hover:scale-110 transition-transform duration-300" />}
              </button>
            )}
        </div>
        
        <div className="mt-6 text-[11px] text-gray-400 font-medium text-left flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-gray-400"></div>
          {t.uploadHint}
        </div>
      </div>

      {/* Directive Card */}
      <div className="bg-gradient-to-b from-white/95 to-white/90 dark:from-slate-900/95 dark:to-slate-900/90 backdrop-blur-xl rounded-[32px] border border-white/40 dark:border-white/10 p-8 shadow-xl shadow-indigo-500/5">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/80 to-white/20 dark:from-white/10 dark:to-white/5 backdrop-blur-md flex items-center justify-center text-primary-600 dark:text-primary-400 border border-white/40 dark:border-white/10 shadow-lg shadow-primary-500/10">
              <Edit3 size={22} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1.5">{t.directive}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Describe your vision clearly</p>
            </div>
          </div>
          
          <div className="relative group mb-8">
              <textarea
                className={`w-full h-32 p-4 bg-gray-50/80 dark:bg-black/30 border border-gray-200/50 dark:border-white/10 hover:border-primary-500/30 rounded-xl text-sm leading-relaxed focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 focus:bg-white dark:focus:bg-black/60 outline-none resize-none placeholder-gray-400 transition-all duration-300 backdrop-blur-sm ${readOnly ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                placeholder={t.directivePlaceholder}
                value={state.requirements}
                onChange={(e) => onUpdate({ requirements: e.target.value })}
                readOnly={readOnly}
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2 pointer-events-none opacity-60 bg-white/80 dark:bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg border border-gray-200/50 dark:border-white/10 shadow-sm">
                <span className="text-3xs font-bold uppercase tracking-widest text-foreground-muted dark:text-gray-400">AI Enhanced</span>
                <Sparkles size={10} className="text-primary-500" />
              </div>
            </div>

            <div className="space-y-5 mb-8">
              {/* Language Selector */}
              <div className="group">
                <label className={`text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 transition-colors ${readOnly ? '' : 'group-hover:text-primary-600'}`}>
                  <Globe size={10} />
                  {t.outputLanguage}
                </label>
                <div className="relative">
                  <button
                    onClick={() => !readOnly && setIsLangOpen(!isLangOpen)}
                    disabled={readOnly}
                    className={`w-full px-3 py-2.5 bg-gray-50/80 dark:bg-black/30 text-sm border transition-all duration-300 rounded-xl outline-none cursor-pointer flex items-center justify-between text-left backdrop-blur-sm ${
                      isLangOpen 
                        ? 'border-primary-500 ring-4 ring-primary-500/10 bg-white dark:bg-black/60' 
                        : 'border-gray-200/50 dark:border-white/10 hover:bg-white/80 dark:hover:bg-black/50 hover:border-gray-300/50'
                    } ${!readOnly ? '' : 'opacity-50 cursor-not-allowed'}`}
                  >
                    <span className="truncate font-medium text-gray-700 dark:text-gray-200">
                      {sortedLanguages.find(l => l.value === state.language)
                        ? (appLanguage === 'Chinese' 
                            ? sortedLanguages.find(l => l.value === state.language)?.labelZh 
                            : sortedLanguages.find(l => l.value === state.language)?.labelEn)
                        : state.language}
                    </span>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isLangOpen ? 'rotate-180 text-primary-500' : ''}`} />
                  </button>
                
                {isLangOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsLangOpen(false)} />
                    <div className="absolute top-full left-0 w-full mt-1.5 max-h-60 overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-xl shadow-xl shadow-black/10 z-20 animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
                      {sortedLanguages.map(lang => (
                        <div
                          key={lang.value}
                          className={`px-3 py-2.5 text-xs cursor-pointer transition-colors flex items-center justify-between ${
                            state.language === lang.value 
                              ? 'bg-primary-50/80 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold' 
                              : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'
                          }`}
                          onClick={() => {
                            onUpdate({ language: lang.value });
                            setIsLangOpen(false);
                          }}
                        >
                          <span>{appLanguage === 'Chinese' ? lang.labelZh : lang.labelEn}</span>
                          {state.language === lang.value && <Check size={12} />}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Grid for Settings */}
            <div className="grid grid-cols-2 gap-3">
              {/* Aspect Ratio */}
              <div className="group">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 transition-colors group-hover:text-primary-600">
                  <ImageIcon size={10} />
                  {t.ratio}
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsRatioOpen(!isRatioOpen)}
                    className={`w-full px-3 py-2.5 bg-gray-50/80 dark:bg-black/30 text-sm border transition-all duration-300 rounded-xl outline-none cursor-pointer flex items-center justify-between text-left backdrop-blur-sm ${
                      isRatioOpen 
                        ? 'border-primary-500 ring-4 ring-primary-500/10 bg-white dark:bg-black/60' 
                        : 'border-gray-200/50 dark:border-white/10 hover:bg-white/80 dark:hover:bg-black/50 hover:border-gray-300/50'
                    }`}
                  >
                    <span className="truncate font-medium text-gray-700 dark:text-gray-200">
                      {[
                        { value: '1:1', label: t.dimOptions.square },
                        { value: '16:9', label: t.dimOptions.landscape },
                        { value: '9:16', label: t.dimOptions.portrait },
                        { value: '4:3', label: t.dimOptions.photo },
                        { value: '3:4', label: t.dimOptions.portrait_3_4 },
                        { value: '2:3', label: t.dimOptions.portrait_2_3 },
                        { value: '3:2', label: t.dimOptions.landscape_3_2 },
                        { value: '4:5', label: t.dimOptions.portrait_4_5 },
                        { value: '5:4', label: t.dimOptions.landscape_5_4 },
                        { value: '21:9', label: t.dimOptions.ultrawide }
                      ].find(o => o.value === state.dimension)?.label || state.dimension}
                    </span>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isRatioOpen ? 'rotate-180 text-primary-500' : ''}`} />
                  </button>
                  
                  {isRatioOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsRatioOpen(false)} />
                      <div className="absolute top-full left-0 w-full mt-1.5 max-h-60 overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-xl shadow-xl shadow-black/10 z-20 animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
                        {[
                          { value: '1:1', label: t.dimOptions.square, iconClass: 'w-3.5 h-3.5' },
                          { value: '16:9', label: t.dimOptions.landscape, iconClass: 'w-4 h-2.5' },
                          { value: '9:16', label: t.dimOptions.portrait, iconClass: 'w-2.5 h-4' },
                          { value: '4:3', label: t.dimOptions.photo, iconClass: 'w-3.5 h-2.5' },
                          { value: '3:4', label: t.dimOptions.portrait_3_4, iconClass: 'w-2.5 h-3.5' },
                          { value: '2:3', label: t.dimOptions.portrait_2_3, iconClass: 'w-2.5 h-3.5' },
                          { value: '3:2', label: t.dimOptions.landscape_3_2, iconClass: 'w-3.5 h-2.5' },
                          { value: '4:5', label: t.dimOptions.portrait_4_5, iconClass: 'w-3 h-3.5' },
                          { value: '5:4', label: t.dimOptions.landscape_5_4, iconClass: 'w-3.5 h-3' },
                          { value: '21:9', label: t.dimOptions.ultrawide, iconClass: 'w-5 h-2' }
                        ].map(opt => (
                          <div
                            key={opt.value}
                            className={`px-3 py-2.5 text-xs cursor-pointer transition-colors flex items-center justify-between ${
                              state.dimension === opt.value 
                                ? 'bg-primary-50/80 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold' 
                                : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'
                            }`}
                            onClick={() => {
                              onUpdate({ dimension: opt.value as any });
                              setIsRatioOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`border rounded-[1px] ${state.dimension === opt.value ? 'border-primary-500' : 'border-gray-400 dark:border-gray-500'} ${opt.iconClass}`}></div>
                              <span>{opt.label}</span>
                            </div>
                            {state.dimension === opt.value && <Check size={12} />}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Output Quality */}
              <div className="group">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 transition-colors group-hover:text-primary-600">
                  <Sparkles size={10} />
                  {t.res}
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsResOpen(!isResOpen)}
                    className={`w-full px-3 py-2.5 bg-gray-50/80 dark:bg-black/30 text-sm border transition-all duration-300 rounded-xl outline-none cursor-pointer flex items-center justify-between text-left backdrop-blur-sm ${
                      isResOpen 
                        ? 'border-primary-500 ring-4 ring-primary-500/10 bg-white dark:bg-black/60' 
                        : 'border-gray-200/50 dark:border-white/10 hover:bg-white/80 dark:hover:bg-black/50 hover:border-gray-300/50'
                    }`}
                  >
                    <span className="truncate font-medium text-gray-700 dark:text-gray-200">
                      {[
                        { value: '1K', label: t.clarityOptions.standard },
                        { value: '2K', label: t.clarityOptions.hd },
                        { value: '4K', label: t.clarityOptions.uhd }
                      ].find(o => o.value === state.clarity)?.label || state.clarity}
                    </span>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isResOpen ? 'rotate-180 text-primary-500' : ''}`} />
                  </button>
                  
                  {isResOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsResOpen(false)} />
                      <div className="absolute top-full left-0 w-full mt-1.5 max-h-60 overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-xl shadow-xl shadow-black/10 z-20 animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
                        {[
                          { value: '1K', label: t.clarityOptions.standard },
                          { value: '2K', label: t.clarityOptions.hd },
                          { value: '4K', label: t.clarityOptions.uhd }
                        ].map(opt => (
                          <div
                            key={opt.value}
                            className={`px-3 py-2.5 text-xs cursor-pointer transition-colors flex items-center justify-between ${
                              state.clarity === opt.value 
                                ? 'bg-primary-50/80 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold' 
                                : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'
                            }`}
                            onClick={() => {
                              onUpdate({ clarity: opt.value as any });
                              setIsResOpen(false);
                            }}
                          >
                            <span>{opt.label}</span>
                            {state.clarity === opt.value && <Check size={12} />}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            {!loading && (
              <div className="group">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 transition-colors group-hover:text-primary-600">
                  <ListOrdered size={10} />
                  {t.quantity}
                </label>
                <div className="flex items-center justify-between p-1 border border-transparent rounded-xl bg-gray-50/80 dark:bg-black/20 backdrop-blur-sm transition-all hover:bg-white/80 dark:hover:bg-black/30 hover:border-gray-200/50 focus-within:border-primary-500/50 focus-within:ring-4 focus-within:ring-primary-500/10 focus-within:bg-white dark:focus-within:bg-black/40">
                  <button 
                    onClick={() => {
                      const newVal = Math.max(1, state.batchCount - 1);
                      onUpdate({ batchCount: newVal });
                    }}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-white dark:hover:bg-white/10 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm active:scale-95"
                    disabled={state.batchCount <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <div className="flex flex-col items-center">
                    <input 
                      type="number" 
                      value={state.batchCount}
                      onChange={(e) => {
                        let val = parseInt(e.target.value);
                        if (isNaN(val)) val = 1;
                        val = Math.max(1, Math.min(20, val));
                        onUpdate({ batchCount: val });
                      }}
                      className="w-10 text-center bg-transparent text-sm font-black text-gray-900 dark:text-white outline-none [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Images</span>
                  </div>
                  <button 
                    onClick={() => {
                      const newVal = Math.min(20, state.batchCount + 1);
                      onUpdate({ batchCount: newVal });
                    }}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-white dark:hover:bg-white/10 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm active:scale-95"
                    disabled={state.batchCount >= 20}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {actionButton}
          </div>
      </div>

      {/* Detail Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div 
            className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-5xl max-h-[85vh] flex flex-col md:flex-row overflow-hidden shadow-2xl ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Section */}
            <div className="md:w-2/3 bg-gray-50/50 dark:bg-black/40 relative flex items-center justify-center p-8">
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
                    style={{ backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)` , backgroundSize: '24px 24px' }}>
                </div>
                <img 
                  src={selectedImage.previewUrl} 
                  className="max-w-full max-h-full object-contain shadow-2xl rounded-lg relative z-10" 
                  alt="Detail" 
                />
            </div>

            {/* Controls Section */}
            <div className="md:w-1/3 flex flex-col bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                           Image Details
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-mono text-xs opacity-70">
                          ID: {selectedImage.id.slice(0, 8)}...
                        </p>
                    </div>
                    <button 
                      onClick={() => { setSelectedImage(null); setIsEditing(false); }} 
                      className="p-2 -mr-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Edit2 size={16} className="text-indigo-600 dark:text-indigo-400" />
                                <span>{(translations[appLanguage] as any).results?.editor || "Editor"}</span>
                            </label>
                        </div>
                        
                        {!isEditing ? (
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 text-center border border-dashed border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                  {(translations[appLanguage] as any).results?.editorHint || "Use AI to edit this image"}
                                </p>
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="w-full py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm"
                                >
                                    {(translations[appLanguage] as any).results?.adjust || "Adjust"}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <textarea 
                                    value={editPrompt}
                                    onChange={(e) => setEditPrompt(e.target.value)}
                                    placeholder={(translations[appLanguage] as any).results?.editPlaceholder || "Describe how to change the image..."}
                                    className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm h-32 resize-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                                    autoFocus
                                />
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium transition-colors"
                                    >
                                        {(translations[appLanguage] as any).results?.cancel || "Cancel"}
                                    </button>
                                    <button 
                                        onClick={handleEdit}
                                        disabled={editLoading || !editPrompt}
                                        className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                                    >
                                        {editLoading ? (
                                          <>
                                            <Loader2 size={16} className="animate-spin" />
                                            {(translations[appLanguage] as any).results?.processing || "Processing"}
                                          </>
                                        ) : (
                                          <>
                                            {(translations[appLanguage] as any).results?.apply || "Apply"}
                                            {costs?.edit && (
                                              <span className="flex items-center text-xs bg-white/20 px-1.5 py-0.5 rounded ml-1">
                                                -{costs.edit} <Sparkles size={10} className="ml-0.5" />
                                              </span>
                                            )}
                                          </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                    <button 
                        className="w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl"
                        onClick={() => downloadImage(selectedImage.previewUrl, generateDownloadFilename(selectedImage.id))}
                    >
                        <Download size={20} />
                        <span>{(translations[appLanguage] as any).results?.download || "Download"}</span>
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectInputPanel;
