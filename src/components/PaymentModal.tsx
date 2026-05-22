import React from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import type { AppLanguage } from '../types';
import { translations } from '../translations';
import { useCreemCheckout } from '../hooks/useCreemCheckout';

interface PaymentModalProps {
    onClose: () => void;
    appLanguage: AppLanguage;
    user?: any;
    profile?: any;
    onLogin?: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, appLanguage, user, profile, onLogin }) => {
    const t = translations[appLanguage].payment;
    
    const { handleCheckout } = useCreemCheckout({
        user,
        profile,
        onLogin,
        appLanguage
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-900">{t.title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div className="border border-indigo-100 bg-indigo-50/50 rounded-xl p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">
                            {t.popular}
                        </div>
                        <h4 className="font-bold text-indigo-900">{t.starterPack}</h4>
                        <div className="flex items-baseline mt-1">
                            <span className="text-2xl font-bold text-gray-900">$10</span>
                            <span className="text-gray-500 ml-1 flex items-center gap-1">
                                <Sparkles size={14} />
                                {t.credits50}
                            </span>
                        </div>
                        <ul className="mt-3 space-y-2 text-sm text-gray-600">
                            <li className="flex items-center gap-2"><Check size={14} className="text-indigo-600"/> {t.highQuality}</li>
                            <li className="flex items-center gap-2"><Check size={14} className="text-indigo-600"/> {t.commercialLicense}</li>
                        </ul>
                        <button 
                            onClick={() => handleCheckout('price_starter')}
                            className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                        >
                            {t.purchase}
                        </button>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4">
                        <h4 className="font-bold text-gray-900">{t.proSub}</h4>
                        <div className="flex items-baseline mt-1">
                            <span className="text-2xl font-bold text-gray-900">$29</span>
                            <span className="text-gray-500 ml-1">{t.perMonth}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{t.unlimited}</p>
                         <button 
                            onClick={() => handleCheckout('price_pro')}
                            className="w-full mt-4 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            {t.subscribe}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
