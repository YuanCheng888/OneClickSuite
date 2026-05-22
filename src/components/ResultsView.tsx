import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, Edit2, Maximize2, X, WandSparkles, Sparkles, CheckCircle2, ArrowLeft, Loader2, History } from 'lucide-react';
import { generateDownloadFilename, fileToBase64 } from '../utils';
import type { ProjectState, GeneratedAsset, AppLanguage } from '../types';
import { editGeneratedImage } from '../services/api';
import { translations } from '../translations';
import { supabase } from '../supabaseClient';
import { APP_NAME } from '../constants';
import StepIndicator from './StepIndicator';

interface ResultsViewProps {
  state: ProjectState;
  onRegenerate: (conceptId: string) => void;
  onRestart: () => void;
  onBack: () => void;
  appLanguage: AppLanguage;
  currentStepIndex: number;
}

const ResultsView: React.FC<ResultsViewProps> = ({ state, onRegenerate, onRestart, onBack, appLanguage, currentStepIndex }) => {
  const [selectedAsset, setSelectedAsset] = useState<GeneratedAsset | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [costs, setCosts] = useState<{ generate: number; edit: number } | null>(null);
  const [historyAssets, setHistoryAssets] = useState<GeneratedAsset[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const t = translations[appLanguage].results;

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

  useEffect(() => {
      if (selectedAsset?.generationId && supabase) {
          fetchHistory(selectedAsset.generationId);
      } else {
          setHistoryAssets([]);
      }
  }, [selectedAsset?.generationId]);

  const fetchHistory = async (genId: string) => {
      if (!supabase) return;
      setLoadingHistory(true);
      const { data } = await supabase
          .from('assets')
          .select('*')
          .eq('generation_id', genId)
          .order('created_at', { ascending: false });
      
      if (data && selectedAsset) {
          const history: GeneratedAsset[] = data.map((item: any) => ({
              id: item.id,
              conceptId: selectedAsset.conceptId,
              imageUrl: item.public_url,
              status: 'success',
              generationId: item.generation_id
          }));
          setHistoryAssets(history);
      }
      setLoadingHistory(false);
  };

  const handleEdit = async () => {
      if (!selectedAsset || !editPrompt) return;
      setEditLoading(true);
      try {
          // Convert URL to Base64
          const res = await fetch(selectedAsset.imageUrl);
          const blob = await res.blob();
          const file = new File([blob], "temp.png", { type: blob.type });
          const imageBase64 = await fileToBase64(file);

          const { imageUrl, asset } = await editGeneratedImage(
              imageBase64, 
              editPrompt,
              selectedAsset.generationId,
              selectedAsset.id
          );
          
          const newAsset = {
              ...selectedAsset,
              imageUrl: imageUrl,
              id: asset?.id || selectedAsset.id,
              generationId: asset?.generationId || selectedAsset.generationId
          };

          setSelectedAsset(newAsset);
          
          // Refresh history
          if (newAsset.generationId) {
              fetchHistory(newAsset.generationId);
          }

          setEditPrompt('');
          setIsEditing(false);
      } catch (e) {
          console.error(e);
          alert(t.editFailed);
      } finally {
          setEditLoading(false);
      }
  }

  const getConceptTitle = (conceptId: string) => {
    return state.brief?.concepts.find(c => c.id === conceptId)?.title || t.untitled;
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

  return (
    <div className="space-y-8 pb-20 transition-colors duration-300">
      <StepIndicator currentStepIndex={currentStepIndex} appLanguage={appLanguage} className="mb-12" />
      
      <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-6 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
             <CheckCircle2 size={22} />
          </div>
          <div>
             <h2 className="text-lg font-bold text-foreground dark:text-white">{t.title}</h2>
             <p className="text-foreground-muted font-medium text-xs">{t.subtitle}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium text-sm flex items-center gap-2 shadow-sm"
          >
            <ArrowLeft size={14} />
            {(t as any).backToBlueprint || 'Back to Blueprint'}
          </button>
          <button
            onClick={onRestart}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium text-sm flex items-center gap-2 shadow-sm"
          >
            <RefreshCw size={14} />
            {t.newProject}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
        {state.assets.map((asset) => (
          <div 
            key={asset.id} 
            className="group relative bg-white dark:bg-gray-800 rounded-[28px] border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            {/* Image Area */}
            <div className="relative aspect-[4/3] bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
              {asset.status === 'loading' ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                   <div className="relative">
                     <WandSparkles size={32} className="text-indigo-500 dark:text-indigo-400 animate-wand-wave" />
                     <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse" />
                   </div>
                   <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 animate-pulse tracking-wide">
                     {t.rendering}
                   </span>
                </div>
              ) : asset.status === 'error' ? (
                <div className="flex flex-col items-center text-red-500 dark:text-red-400 p-4 text-center">
                  <X size={32} className="mb-2 opacity-50" />
                  <span className="text-sm font-medium">{t.failed}</span>
                </div>
              ) : (
                <>
                  <img 
                    src={asset.imageUrl} 
                    alt="Generated" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 gap-3">
                     <button 
                        onClick={() => setSelectedAsset(asset)}
                        className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white transition-colors"
                        title="View Details"
                     >
                       <Maximize2 size={20} />
                     </button>
                     <button 
                        onClick={() => downloadImage(asset.imageUrl, `${APP_NAME.toLowerCase().replace(/\s+/g, '-')}-${asset.id}.png`)}
                        className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white transition-colors"
                        title="Download"
                     >
                       <Download size={20} />
                     </button>
                  </div>
                </>
              )}
            </div>
            
            {/* Card Footer */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-foreground dark:text-white text-lg leading-tight">
                    {getConceptTitle(asset.conceptId)}
                  </h3>
                  <span className="text-2xs font-bold text-foreground-subtle uppercase tracking-widest mt-1 block">
                    {state.clarity} • {state.dimension}
                  </span>
                </div>
              </div>
              
              {asset.status !== 'loading' && (
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => onRegenerate(asset.conceptId)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all text-sm font-medium group/btn"
                    >
                        <RefreshCw size={16} className="group-hover/btn:rotate-180 transition-transform duration-500" />
                        <span>Regenerate</span>
                        {costs?.generate && (
                          <span className="flex items-center text-xs opacity-60 ml-0.5">
                            -{costs.generate} <Sparkles size={10} className="ml-0.5" />
                          </span>
                        )}
                    </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedAsset && (
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
                  src={selectedAsset.imageUrl} 
                  className="max-w-full max-h-full object-contain shadow-2xl rounded-lg relative z-10" 
                  alt="Detail" 
                />
            </div>

            {/* Controls Section */}
            <div className="md:w-1/3 flex flex-col bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-foreground dark:text-white">
                          {getConceptTitle(selectedAsset.conceptId)}
                        </h3>
                        <p className="text-xs text-foreground-subtle mt-1 font-mono opacity-70">
                          ID: {selectedAsset.id.slice(0, 8)}...
                        </p>
                    </div>
                    <button 
                      onClick={() => { setSelectedAsset(null); setIsEditing(false); }} 
                      className="p-2 -mr-2 text-foreground-subtle hover:text-foreground dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-foreground dark:text-white flex items-center gap-2">
                                <Edit2 size={16} className="text-indigo-600 dark:text-indigo-400" />
                                <span>{t.editor}</span>
                            </label>
                        </div>
                        
                        {!isEditing ? (
                            <div className="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl p-6 text-center border border-indigo-100 dark:border-indigo-500/20">
                                <p className="text-sm text-foreground-muted dark:text-gray-300 mb-4 font-medium">
                                  {t.editorHint}
                                </p>
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="w-full py-3 bg-white dark:bg-indigo-600 border border-indigo-200 dark:border-indigo-500/50 rounded-xl text-sm font-bold text-indigo-700 dark:text-white hover:bg-indigo-50 dark:hover:bg-indigo-500 transition-all shadow-sm flex items-center justify-center gap-2"
                                >
                                    <WandSparkles size={16} />
                                    {t.adjust}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <textarea 
                                    value={editPrompt}
                                    onChange={(e) => setEditPrompt(e.target.value)}
                                    placeholder={t.editPlaceholder}
                                    className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm h-32 resize-none bg-gray-50 dark:bg-gray-800 text-foreground dark:text-white placeholder-gray-400 transition-all"
                                    autoFocus
                                />
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-foreground-muted dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium transition-colors"
                                    >
                                        {t.cancel}
                                    </button>
                                    <button 
                                        onClick={handleEdit}
                                        disabled={editLoading || !editPrompt}
                                        className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                                    >
                                        {editLoading ? (
                                          <>
                                            <Loader2 size={16} className="animate-spin" />
                                            {t.processing}
                                          </>
                                        ) : (
                                          <>
                                            {t.apply}
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

                    {/* History Section */}
                    {selectedAsset && (
                      <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold text-foreground dark:text-white flex items-center gap-2">
                                <History size={16} />
                                {(t as any).history || (appLanguage === 'Chinese' ? '历史版本' : 'Version History')}
                            </h4>
                            {loadingHistory && <Loader2 size={14} className="animate-spin text-gray-400" />}
                          </div>
                          
                          {historyAssets.length > 0 ? (
                            <div className="grid grid-cols-3 gap-3">
                                {historyAssets.map((asset) => (
                                    <button
                                        key={asset.id}
                                        onClick={() => setSelectedAsset({...asset, conceptId: selectedAsset.conceptId})}
                                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedAsset.id === asset.id ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'}`}
                                    >
                                        <img src={asset.imageUrl} className="w-full h-full object-cover" alt="History" />
                                    </button>
                                ))}
                            </div>
                          ) : (
                             <p className="text-xs text-gray-400 italic">
                               {(t as any).noHistory || (appLanguage === 'Chinese' ? '暂无历史记录' : 'No history available')}
                             </p>
                          )}
                      </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                    <button 
                        className="w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl"
                        onClick={() => downloadImage(selectedAsset.imageUrl, generateDownloadFilename(selectedAsset.id))}
                    >
                        <Download size={20} />
                        <span>{t.download}</span>
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsView;