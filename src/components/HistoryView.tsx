
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Download, Trash2, Calendar, Loader2, Image as ImageIcon, AlertCircle, Maximize2, X, Edit2, WandSparkles, Sparkles, History } from 'lucide-react';
import type { AppLanguage } from '../types';
import { translations } from '../translations';
import { APP_NAME } from '../constants';
import { formatDateForFilename, generateDownloadFilename, fileToBase64 } from '../utils';
import { editGeneratedImage } from '../services/api';

interface HistoryItem {
  id: string;
  created_at: string;
  public_url: string;
  storage_path: string;
  metadata: any;
  generation_id?: string;
  generation: {
    prompt: string;
    parameters: any;
  };
}

interface HistoryViewProps {
  appLanguage?: AppLanguage;
}

const HistoryView: React.FC<HistoryViewProps> = ({ appLanguage = 'English' }) => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [groupedItems, setGroupedItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [costs, setCosts] = useState<{ generate: number; edit: number } | null>(null);
  
  // History versions for the selected item (same generation_id)
  const [versionHistory, setVersionHistory] = useState<HistoryItem[]>([]);

  const t = translations[appLanguage].history;

  useEffect(() => {
    fetchHistory();
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

  // When selected item changes, update the version history list
  useEffect(() => {
    if (selectedItem) {
      if (selectedItem.generation_id) {
        // Filter items with same generation_id
        const versions = items.filter(item => item.generation_id === selectedItem.generation_id);
        // Sort by created_at desc (newest first)
        versions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setVersionHistory(versions);
      } else {
        setVersionHistory([selectedItem]);
      }
    } else {
      setVersionHistory([]);
    }
  }, [selectedItem, items]);

  const fetchHistory = async () => {
    if (!supabase) return;
    try {
      setLoading(true);
      const { data, error } = await supabase.from('assets')
        .select(`
          *,
          generation:generations(prompt, parameters)
        `)
        .eq('asset_type', 'image')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const allItems = data || [];
      setItems(allItems);
      
      // Group by generation_id and take the latest one
      const groups: Record<string, HistoryItem> = {};
      const singles: HistoryItem[] = [];

      allItems.forEach(item => {
        if (item.generation_id) {
          if (!groups[item.generation_id]) {
            groups[item.generation_id] = item;
          } else {
            // Since we ordered by created_at desc, the first one encountered is the latest
            // No need to replace unless we processed in random order
          }
        } else {
          singles.push(item);
        }
      });

      // Combine latest from groups and singles
      const grouped = [...Object.values(groups), ...singles];
      // Sort again by created_at desc
      grouped.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setGroupedItems(grouped);

    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedItem || !editPrompt) return;
    setEditLoading(true);
    try {
        // Convert URL to Base64
        const res = await fetch(selectedItem.public_url);
        const blob = await res.blob();
        const file = new File([blob], "temp.png", { type: blob.type });
        const imageBase64 = await fileToBase64(file);

        const { imageUrl: newImageBase64, asset } = await editGeneratedImage(
            imageBase64, 
            editPrompt, 
            selectedItem.generation_id,
            selectedItem.id
        );

        // Update local state
        const newItem = {
            ...selectedItem,
            id: asset?.id || selectedItem.id, // Should be new ID
            public_url: newImageBase64,
            created_at: new Date().toISOString(),
            // Ensure metadata or generation info is preserved/updated if needed
        };

        // If we got a new asset from backend, we should refresh the whole list or manually insert it
        // Refreshing is safer to get correct DB state
        await fetchHistory();
        
        // Update selected item to the new one
        // We need to find the new item in the refreshed list or construct it
        // For smoother UX, let's try to construct it or find it after fetch
        
        // Just set the selected item to what we have, the effect will update version history
        setSelectedItem(newItem);
        
        setEditPrompt('');
        setIsEditing(false);
    } catch (e: any) {
        console.error(e);
        alert((translations[appLanguage] as any).results?.editFailed || "Edit failed");
    } finally {
        setEditLoading(false);
    }
  };

  const handleDelete = async (id: string, storagePath: string) => {
    const client = supabase;
    if (!client) return;
    if (!confirm(t.confirmDelete)) return;
    setDeletingId(id);
    try {
      // 1. Delete from Storage
      const { error: storageError } = await client.storage
        .from('generated-images')
        .remove([storagePath]);
      
      if (storageError) console.warn('Storage delete error:', storageError);

      // 2. Delete from DB
      const { error: dbError } = await client
        .from('assets')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      // Update UI
      setItems(prev => prev.filter(item => item.id !== id));
      setGroupedItems(prev => prev.filter(item => item.id !== id));
      
      // If deleting the currently selected item, select another one from history or close
      if (selectedItem?.id === id) {
          const nextVersion = versionHistory.find(v => v.id !== id);
          if (nextVersion) {
              setSelectedItem(nextVersion);
          } else {
              setSelectedItem(null);
          }
      }

    } catch (error) {
      console.error('Error deleting image:', error);
      alert(t.deleteFailed);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
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
      window.open(url, '_blank');
    }
  };

  const getTitle = (item: HistoryItem) => {
    // If grouped, we might want to find the "original" generation prompt
    // But usually the generation object is attached to all assets in that generation
    return item.metadata?.conceptName || 
           item.generation?.parameters?.conceptName || 
           (typeof item.generation?.prompt === 'object' ? (item.generation.prompt as any).title : item.generation?.prompt) || 
           'Image Details';
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-lg font-bold text-foreground dark:text-white">{t.title}</h1>
          <p className="text-xs text-foreground-muted dark:text-gray-400 mt-1">{t.subtitle}</p>
        </div>
        <div className="text-xs text-foreground-muted dark:text-gray-500">
          {groupedItems.length} {t.items}
        </div>
      </div>

      {groupedItems.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 border-dashed">
          <ImageIcon className="mx-auto h-12 w-12 text-slate-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">{t.noHistory.split('.')[0]}</h3>
          <p className="text-slate-500 dark:text-gray-400 mt-2">{t.noHistory.split('. ')[1]}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {groupedItems.map((item) => (
            <div 
              key={item.id} 
              className="group relative bg-white dark:bg-[#1c2230] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-200 dark:border-white/10 cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              {/* Image */}
              <div className="aspect-square relative overflow-hidden bg-slate-100 dark:bg-black/20">
                <img 
                  src={item.public_url} 
                  alt={item.generation?.prompt || 'Generated Image'} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 gap-3">
                   <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                      className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white transition-colors"
                      title="View Details"
                   >
                     <Maximize2 size={20} />
                   </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDownload(item.public_url, generateDownloadFilename(item.id, item.created_at)); }}
                    className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white transition-colors"
                    title="Download"
                  >
                    <Download size={20} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id, item.storage_path); }}
                    className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors"
                    title="Delete"
                    disabled={deletingId === item.id}
                  >
                    {deletingId === item.id ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                  </button>
                </div>
                
                {/* Version Badge */}
                {items.filter(i => i.generation_id === item.generation_id).length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
                        <History size={10} />
                        <span>{items.filter(i => i.generation_id === item.generation_id).length}</span>
                    </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-sm font-medium text-foreground dark:text-white line-clamp-2 mb-2" title={item.generation?.prompt}>
                  {getTitle(item)}
                </p>
                <div className="flex items-center justify-between text-xs text-foreground-muted dark:text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  {item.metadata?.dimension && (
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 rounded text-[10px] font-mono">
                      {item.metadata.dimension}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
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
                  src={selectedItem.public_url} 
                  className="max-w-full max-h-full object-contain shadow-2xl rounded-lg relative z-10" 
                  alt="Detail" 
                />
            </div>

            {/* Controls Section */}
            <div className="md:w-1/3 flex flex-col bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start">
                    <div className="flex-1 min-w-0 pr-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 break-words">
                           {getTitle(selectedItem)}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-mono text-xs opacity-70">
                          {new Date(selectedItem.created_at).toLocaleString()}
                        </p>
                    </div>
                    <button 
                      onClick={() => { setSelectedItem(null); setIsEditing(false); }} 
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
                            <div className="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl p-6 text-center border border-indigo-100 dark:border-indigo-500/20">
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 font-medium">
                                  {(translations[appLanguage] as any).results?.editorHint || "Click to refine details, change background, or adjust lighting."}
                                </p>
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="w-full py-3 bg-white dark:bg-indigo-600 border border-indigo-200 dark:border-indigo-500/50 rounded-xl text-sm font-bold text-indigo-700 dark:text-white hover:bg-indigo-50 dark:hover:bg-indigo-500 transition-all shadow-sm flex items-center justify-center gap-2"
                                >
                                    <WandSparkles size={16} />
                                    {(translations[appLanguage] as any).results?.adjust || "Refine"}
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

                    {/* Version History in Modal */}
                    {versionHistory.length > 0 && (
                      <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold text-foreground dark:text-white flex items-center gap-2">
                                <History size={16} />
                                {(translations[appLanguage] as any).results?.history || (appLanguage === 'Chinese' ? '历史版本' : 'Version History')}
                            </h4>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-3">
                              {versionHistory.map((vItem) => (
                                  <button
                                      key={vItem.id}
                                      onClick={() => setSelectedItem(vItem)}
                                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedItem.id === vItem.id ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'}`}
                                  >
                                      <img src={vItem.public_url} className="w-full h-full object-cover" alt="History" />
                                  </button>
                              ))}
                          </div>
                      </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                    <button 
                        className="w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl"
                        onClick={() => handleDownload(selectedItem.public_url, generateDownloadFilename(selectedItem.id, selectedItem.created_at))}
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

export default HistoryView;
