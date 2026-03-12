import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Trash2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSingle: () => void;
  onConfirmSeries?: () => void;
  isInstallment?: boolean;
  description?: string;
  isDeleting?: boolean;
}

export function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirmSingle, 
  onConfirmSeries, 
  isInstallment,
  description,
  isDeleting = false
}: Props) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isDeleting ? onClose : undefined}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-[#FDFBF7] w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border border-[#8A9A5B]/10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">Excluir Lançamento?</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">AÇÃO IRREVERSÍVEL</p>
            </div>
            <button 
              onClick={onClose}
              disabled={isDeleting}
              className="ml-auto p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-30"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="bg-rose-50/30 rounded-3xl p-6 border border-rose-100/50 mb-8">
            <p className="text-sm font-bold text-slate-600 leading-relaxed text-center">
              Tem certeza que deseja excluir esta conta? <span className="text-rose-600">Esta operação não poderá ser desfeita.</span>
            </p>
            {description && (
              <div className="mt-4 p-3 bg-white/60 rounded-xl border border-white text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter truncate">"{description}"</p>
              </div>
            )}
            {isInstallment && (
              <div className="mt-5 flex items-start gap-3 text-amber-600 bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p className="text-[10px] font-black uppercase tracking-tight leading-normal">
                  Este item faz parte de um parcelamento. Escolha se deseja excluir apenas esta parcela ou toda a série.
                </p>
              </div>
            )}
          </div>

          {/* Footer / Buttons */}
          <div className="space-y-3">
            {isInstallment && onConfirmSeries ? (
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={onConfirmSeries}
                  disabled={isDeleting}
                  className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 shadow-xl shadow-rose-600/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isDeleting ? 'Excluindo série...' : 'Excluir Todas as Parcelas'}
                </button>
                <button
                  onClick={onConfirmSingle}
                  disabled={isDeleting}
                  className="w-full py-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-100 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isDeleting ? 'Excluindo parcela...' : 'Excluir Apenas Esta'}
                </button>
              </div>
            ) : (
              <button
                onClick={onConfirmSingle}
                disabled={isDeleting}
                className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 shadow-xl shadow-rose-600/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {isDeleting ? 'Excluindo lançamento...' : 'Confirmar Exclusão'}
              </button>
            )}
            
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 active:scale-95 transition-all disabled:opacity-50"
            >
              Manter Lançamento
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
