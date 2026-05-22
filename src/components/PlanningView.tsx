
import React, { useState, useEffect } from 'react';
import { Palette, ArrowRight, Wand2, Trash2, Plus, ChevronDown, ChevronUp, Camera, Box, Layout as LayoutIcon, Image as ImageIcon, Languages, Sparkles, Edit3, X, WandSparkles, FileText, Loader2, AlertTriangle } from 'lucide-react';
import type { ProjectState, DesignBrief, ImageConcept, AppLanguage, User } from '../types';
import { translations } from '../translations';
import { supabase } from '../supabaseClient';
import ProjectInputPanel from './ProjectInputPanel';
import StepIndicator from './StepIndicator';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-[320px] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-200">
        <div className="p-5 text-center">
          <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-3 text-red-500 dark:text-red-400">
             <AlertTriangle size={20} />
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
            className="flex-1 py-2 px-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-xs transition-colors shadow-lg shadow-red-500/20"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const EditableField = ({ 
  label, 
  value, 
  onSave, 
  multiline = true,
  icon: Icon
}: { 
  label: string; 
  value: string; 
  onSave: (val: string) => void; 
  multiline?: boolean;
  icon?: any;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(localValue);
    setIsEditing(false);
  };

  return (
    <div>
       <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            {Icon && <Icon size={12} className="text-foreground-subtle" />}
            <span className="text-2xs font-black text-foreground-subtle uppercase tracking-widest">{label}</span>
          </div>
          <button onClick={() => setIsEditing(!isEditing)} className="text-foreground-subtle hover:text-indigo-600 transition-colors p-1">
            <Edit3 size={12} />
          </button>
       </div>
       {isEditing ? (
         multiline ? (
           <textarea 
             value={localValue}
             onChange={(e) => setLocalValue(e.target.value)}
             onBlur={handleSave}
             className="w-full text-xs p-2 bg-gray-50/80 dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800 rounded-md focus:ring-2 focus:ring-indigo-500/20 outline-none"
             autoFocus
             rows={3}
           />
         ) : (
           <input 
             value={localValue}
             onChange={(e) => setLocalValue(e.target.value)}
             onBlur={handleSave}
             className="w-full text-xs p-2 bg-gray-50/80 dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800 rounded-md focus:ring-2 focus:ring-indigo-500/20 outline-none"
             autoFocus
             />
         )
       ) : (
           <p className="text-xs font-normal text-foreground dark:text-gray-200 whitespace-pre-wrap">{value}</p>
         )}
    </div>
  );
};
 
 const ColorCapsule = ({ color, onDelete, onUpdate }: { color: string, onDelete: () => void, onUpdate: (c: string) => void }) => {
   const [isEditing, setIsEditing] = useState(false);
   const [localColor, setLocalColor] = useState(color);
 
   React.useEffect(() => setLocalColor(color), [color]);
 
   const handleSave = () => {
       onUpdate(localColor);
       setIsEditing(false);
   };
 
   return (
      <div className="group relative flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm hover:border-indigo-200 transition-colors">
         <div className="w-4 h-4 rounded-full border border-gray-200 shadow-inner" style={{ backgroundColor: color }}></div>
         {isEditing ? (
             <input 
                value={localColor}
                onChange={(e) => setLocalColor(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="w-20 text-2xs font-mono font-bold uppercase bg-transparent outline-none"
                autoFocus
             />
         ) : (
            <span 
               onClick={() => setIsEditing(true)}
               className="text-2xs font-mono font-bold uppercase cursor-pointer hover:text-indigo-600"
            >
               {color}
            </span>
         )}
         <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="ml-1 opacity-0 group-hover:opacity-100 text-foreground-subtle hover:text-red-500 transition-opacity"
         >
            <X size={12} />
         </button>
      </div>
    );
 };

 interface PlanningViewProps {
  state: ProjectState;
  onUpdateBrief: (brief: DesignBrief) => void;
  onUpdateState: (updates: Partial<ProjectState>) => void;
  onNext: () => void;
  onBack: () => void;
  loading: boolean;
  appLanguage?: AppLanguage;
  user: User | null;
  profile: any;
  onGoPricing: () => void;
  currentStepIndex: number;
  onLogin?: () => void;
}

const PlanningView: React.FC<PlanningViewProps> = ({ 
  state, 
  onUpdateBrief, 
  onUpdateState, 
  onNext, 
  onBack, 
  loading, 
  appLanguage = 'English',
  user,
  profile,
  onGoPricing,
  currentStepIndex,
  onLogin
}) => {
  const [specsExpanded, setSpecsExpanded] = useState(true);
  const [expandedConceptId, setExpandedConceptId] = useState<string | null>(null);
  const [generateCost, setGenerateCost] = useState<number | null>(null);
  const [showBackConfirm, setShowBackConfirm] = useState(false);

  useEffect(() => {
    const fetchGenerateCost = async () => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('credit_rules')
        .select('cost')
        .eq('action_type', 'generate')
        .single();
      
      if (data && !error) {
        setGenerateCost(data.cost);
      }
    };

    fetchGenerateCost();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!state.brief) return null;

  const { specs, concepts } = state.brief;
  const t = translations[appLanguage].studio;

  const requiredCredits = (generateCost || 0) * concepts.length;
  const currentCredits = profile?.credits || 0;
  const isInsufficient = user && currentCredits < requiredCredits;
  const canGenerate = generateCost ? Math.floor(currentCredits / generateCost) : 0;

  const handleAddConcept = () => {
    if (!state.brief) return;
    const nextIndex = state.brief.concepts.length + 1;
    const newConcept: ImageConcept = {
        id: Math.random().toString(36).substring(7),
        title: t.shotTitleTemplate ? t.shotTitleTemplate(nextIndex) : `Shot ${nextIndex}`,
        description: '',
        prompt: (t as any).defaultPrompt || 'Product close-up...'
    };
    onUpdateBrief({
        ...state.brief,
        concepts: [...state.brief.concepts, newConcept]
    });
  };

  const handleRemoveConcept = (id: string) => {
    if (!state.brief) return;
    onUpdateBrief({
        ...state.brief,
        concepts: state.brief.concepts.filter(c => c.id !== id)
    });
  };

  const handleBack = () => {
    setShowBackConfirm(true);
  };

  const confirmBack = () => {
    setShowBackConfirm(false);
    onBack();
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-700">
      <ConfirmationModal
        isOpen={showBackConfirm}
        onClose={() => setShowBackConfirm(false)}
        onConfirm={confirmBack}
        title={(t as any).confirmBackTitle}
        description={(t as any).confirmBackDesc}
        confirmText={(t as any).confirmBackBtn}
        cancelText={(t as any).cancelBackBtn}
      />

      <StepIndicator currentStepIndex={currentStepIndex} appLanguage={appLanguage} className="mb-12" />
      <div className="flex justify-between items-end mb-6 shrink-0 px-2">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
               <FileText size={22} />
            </div>
            <div>
               <h2 className="text-lg font-bold text-foreground dark:text-white">{t.blueprint}</h2>
               <p className="text-foreground-muted font-medium text-xs">{t.strategy}</p>
            </div>
         </div>
         <div className="flex space-x-3">
          <button
            onClick={handleBack}
            className="px-4 py-2 text-foreground-muted dark:text-gray-400 font-medium text-sm hover:text-foreground dark:hover:text-white transition-colors"
          >
            {(t as any).back}
          </button>
          {isInsufficient ? (
            <div className="flex flex-col items-end gap-1">
              <button
                onClick={onGoPricing}
                className="px-6 py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-sm transition-all shadow-xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:opacity-90 active:scale-95"
              >
                <Sparkles size={20} className="text-primary-500" />
                <span>{(t as any).btnBuyCredits}</span>
              </button>
              <p className="text-[10px] text-red-500 font-medium px-1">
                {(t as any).insufficientCredits(requiredCredits, currentCredits, canGenerate)}
              </p>
            </div>
          ) : (
            <button
              onClick={onNext}
              disabled={loading || concepts.length === 0}
              className={`px-10 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm transition-all shadow-xl ${loading || concepts.length === 0 ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-violet-600 via-primary-500 to-indigo-500 text-white hover:scale-[1.02] active:scale-95 shadow-primary-500/20'}`}
            >
              {loading ? (
                <>
                   <Loader2 size={24} className="animate-spin" />
                   <span>{(t as any).initializing}</span>
                </>
              ) : (
                <>
                    <span>{(t as any).beginRendering}</span>
                    {generateCost !== null && (
                      <span className="text-sm opacity-80 font-normal ml-1 flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-lg">
                        - {requiredCredits} <Sparkles size={14} />
                      </span>
                    )}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden min-h-0">
        {/* Left Panel: Inputs */}
        <div className="lg:col-span-1 overflow-y-auto pr-2 custom-scrollbar">
          <ProjectInputPanel 
            state={state}
            onUpdate={onUpdateState}
            user={user}
            appLanguage={appLanguage}
            profile={profile}
            onGoPricing={onGoPricing}
            loading={loading}
            readOnly={true}
            onLogin={onLogin}
            // No action button in the input panel for Planning View
          />
        </div>

        {/* Right Panel: Blueprint */}
        <div className="lg:col-span-2 overflow-y-auto pr-2 custom-scrollbar space-y-6 pb-20 animate-in fade-in slide-in-from-right-8 duration-700">
          
          <div className="px-2">
              <div className="flex items-center gap-2">
                 <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                    <Palette size={16} />
                 </div>
                 <div>
                    <h3 className="font-bold text-sm text-foreground dark:text-white">{(t as any).designBlueprint}</h3>
                    <p className="text-2xs text-foreground-subtle font-medium uppercase tracking-wide">{(t as any).designBlueprintDesc}</p>
                </div>
             </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-[28px] border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-all group">
             <button 
              onClick={() => setSpecsExpanded(!specsExpanded)}
              className="w-full p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
             >
                <div className="flex items-center gap-3">
                   <span className="font-bold text-sm tracking-tight">{t.standards}</span>
                </div>
                {specsExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
             </button>

             <div className={`grid transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${specsExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
               <div className="overflow-hidden">
                 <div className="px-5 pb-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-700">
                       <EditableField 
                          label={t.style} 
                          value={state.brief?.specs.style || ''} 
                          onSave={(val) => onUpdateBrief({...state.brief!, specs: {...state.brief!.specs, style: val}})}
                       />
                       <div>
                          <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center gap-1">
                               <span className="text-2xs font-black text-foreground-subtle uppercase tracking-widest">{t.colors}</span>
                             </div>
                             <button 
                               onClick={() => {
                                  const newColors = [...state.brief!.specs.colorPalette, '#000000'];
                                  onUpdateBrief({...state.brief!, specs: {...state.brief!.specs, colorPalette: newColors}});
                               }} 
                               className="text-foreground-subtle hover:text-indigo-600 transition-colors p-1"
                             >
                               <Plus size={12} />
                             </button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                             {state.brief?.specs.colorPalette.map((c, i) => (
                               <ColorCapsule 
                                  key={i} 
                                  color={c} 
                                  onDelete={() => {
                                      const newColors = state.brief!.specs.colorPalette.filter((_, idx) => idx !== i);
                                      onUpdateBrief({...state.brief!, specs: {...state.brief!.specs, colorPalette: newColors}});
                                  }}
                                  onUpdate={(newColor) => {
                                      const newColors = [...state.brief!.specs.colorPalette];
                                      newColors[i] = newColor;
                                      onUpdateBrief({...state.brief!, specs: {...state.brief!.specs, colorPalette: newColors}});
                                  }}
                               />
                             ))}
                          </div>
                       </div>
                       <EditableField 
                          label={t.lighting} 
                          value={state.brief?.specs.lighting || ''} 
                          onSave={(val) => onUpdateBrief({...state.brief!, specs: {...state.brief!.specs, lighting: val}})}
                       />
                       <EditableField 
                          label={t.quality} 
                          value={state.brief?.specs.qualityRequirements || "UHD clarity with professional commercial retouching standards."} 
                          onSave={(val) => onUpdateBrief({...state.brief!, specs: {...state.brief!.specs, qualityRequirements: val}})}
                       />
                    </div>
                 </div>
               </div>
             </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-center justify-between px-2 mb-2">
                <div className="flex items-center gap-2">
                   <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Camera size={16} />
                   </div>
                   <span className="font-bold text-sm">{t.shotSequences}</span>
                </div>
                <span className="text-2xs font-black text-foreground-subtle uppercase tracking-widest">{t.planned}: {state.brief?.concepts.length}</span>
             </div>

             <div className="grid grid-cols-1 gap-4">
                {state.brief?.concepts.map((concept, idx) => (
                     <div key={concept.id} className={`bg-white dark:bg-gray-800 rounded-[28px] border shadow-sm overflow-hidden transition-all ${expandedConceptId === concept.id ? 'border-indigo-200 dark:border-indigo-500/50 ring-4 ring-indigo-500/5' : 'border-gray-200 dark:border-gray-700'}`}>
                        <button 
                          onClick={(e) => {
                             e.stopPropagation();
                             setExpandedConceptId(expandedConceptId === concept.id ? null : concept.id);
                          }}
                          className="w-full p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                           <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl font-black flex items-center justify-center text-sm shadow-lg transition-all ${expandedConceptId === concept.id ? 'bg-indigo-600 text-white shadow-indigo-500/20 rotate-6' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 shadow-none'}`}>
                                 {idx + 1}
                              </div>
                              <div className="text-left">
                                 <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{concept.title}</h4>
                                 <p className="text-[10px] text-gray-400 font-medium">{concept.description.slice(0, 65)}...</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-2">
                             {(state.brief?.concepts.length || 0) > 1 && (
                               <div 
                                  onClick={(e) => {
                                     e.stopPropagation();
                                     handleRemoveConcept(concept.id);
                                  }}
                                  className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                               >
                                  <Trash2 size={16} />
                               </div>
                             )}
                             {expandedConceptId === concept.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                           </div>
                        </button>

                        <div className={`grid transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${expandedConceptId === concept.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                           <div className="overflow-hidden">
                              <div className="px-5 pb-6">
                                 <div className="p-5 bg-indigo-50/30 dark:bg-gray-900/40 border border-indigo-100/50 dark:border-gray-700/50 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                       <EditableField 
                                          label={t.elements} 
                                          value={concept.details?.props || "Default product elements"} 
                                          onSave={(val) => {
                                             const newConcepts = [...state.brief!.concepts];
                                             const idx = newConcepts.findIndex(c => c.id === concept.id);
                                             if (idx !== -1) {
                                                newConcepts[idx] = { ...newConcepts[idx], details: { ...newConcepts[idx].details!, props: val } };
                                                onUpdateBrief({ ...state.brief!, concepts: newConcepts });
                                             }
                                          }}
                                          icon={Box}
                                       />
                                       <EditableField 
                                          label={t.composition} 
                                          value={concept.details?.composition || "Professional balanced framing"} 
                                          onSave={(val) => {
                                             const newConcepts = [...state.brief!.concepts];
                                             const idx = newConcepts.findIndex(c => c.id === concept.id);
                                             if (idx !== -1) {
                                                newConcepts[idx] = { ...newConcepts[idx], details: { ...newConcepts[idx].details!, composition: val } };
                                                onUpdateBrief({ ...state.brief!, concepts: newConcepts });
                                             }
                                          }}
                                          icon={LayoutIcon}
                                       />
                                       <EditableField 
                                          label={t.mood} 
                                          value={concept.details?.mood || "Commercial high-end aesthetic"} 
                                          onSave={(val) => {
                                             const newConcepts = [...state.brief!.concepts];
                                             const idx = newConcepts.findIndex(c => c.id === concept.id);
                                             if (idx !== -1) {
                                                newConcepts[idx] = { ...newConcepts[idx], details: { ...newConcepts[idx].details!, mood: val } };
                                                onUpdateBrief({ ...state.brief!, concepts: newConcepts });
                                             }
                                          }}
                                          icon={Sparkles}
                                       />
                                    </div>
                                    <div className="space-y-4">
                                       <div>
                                          <h5 className="text-3xs font-black text-indigo-400 dark:text-indigo-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                            <Languages size={10} /> {(t as any).textContentWithLang(state.language || (t as any).outputLanguage)}
                                          </h5>
                                          <div className="pl-3 border-l border-indigo-200/50 dark:border-indigo-500/30 space-y-2">
                                             <EditableField 
                                                label={(t as any).headline} 
                                                value={concept.details?.textContent?.headline || ''}
                                                onSave={(val) => {
                                                   const newConcepts = [...state.brief!.concepts];
                                                   const idx = newConcepts.findIndex(c => c.id === concept.id);
                                                   if (idx !== -1) {
                                                      const newDetails = { ...newConcepts[idx].details! };
                                                      newDetails.textContent = { ...newDetails.textContent!, headline: val };
                                                      newConcepts[idx] = { ...newConcepts[idx], details: newDetails };
                                                      onUpdateBrief({ ...state.brief!, concepts: newConcepts });
                                                   }
                                                }}
                                                multiline={false}
                                             />
                                             <EditableField 
                                                label={(t as any).subline} 
                                                value={concept.details?.textContent?.subline || ''}
                                                onSave={(val) => {
                                                   const newConcepts = [...state.brief!.concepts];
                                                   const idx = newConcepts.findIndex(c => c.id === concept.id);
                                                   if (idx !== -1) {
                                                      const newDetails = { ...newConcepts[idx].details! };
                                                      newDetails.textContent = { ...newDetails.textContent!, subline: val };
                                                      newConcepts[idx] = { ...newConcepts[idx], details: newDetails };
                                                      onUpdateBrief({ ...state.brief!, concepts: newConcepts });
                                                   }
                                                }}
                                                multiline={false}
                                             />
                                             <EditableField 
                                                label={(t as any).description} 
                                                value={concept.details?.textContent?.description || ''}
                                                onSave={(val) => {
                                                   const newConcepts = [...state.brief!.concepts];
                                                   const idx = newConcepts.findIndex(c => c.id === concept.id);
                                                   if (idx !== -1) {
                                                      const newDetails = { ...newConcepts[idx].details! };
                                                      newDetails.textContent = { ...newDetails.textContent!, description: val };
                                                      newConcepts[idx] = { ...newConcepts[idx], details: newDetails };
                                                      onUpdateBrief({ ...state.brief!, concepts: newConcepts });
                                                   }
                                                }}
                                             />
                                          </div>
                                       </div>
                                       <div className="pt-3 border-t border-indigo-100 dark:border-gray-700">
                                          <EditableField 
                                             label={(t as any).conceptSummary} 
                                             value={concept.prompt} 
                                             onSave={(val) => {
                                                const newConcepts = [...state.brief!.concepts];
                                                const idxToUpdate = newConcepts.findIndex(c => c.id === concept.id);
                                                if (idxToUpdate !== -1) {
                                                    newConcepts[idxToUpdate] = { ...newConcepts[idxToUpdate], prompt: val };
                                                    onUpdateBrief({ ...state.brief!, concepts: newConcepts });
                                                }
                                             }}
                                             icon={Wand2}
                                          />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                ))}
                
                <button 
                  onClick={handleAddConcept}
                  className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[28px] text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all font-bold text-sm flex items-center justify-center gap-2"
                >
                   <Plus size={18} />
                   <span>{t.addShot}</span>
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanningView;
