import React from 'react';
import { useRekart } from '../../context/RekartContext';
import { CheckCircle2, AlertCircle, Info, X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const NotificationsToast: React.FC = () => {
  const { notifications, dismissNotification } = useRekart();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {notifications.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border backdrop-blur-md flex items-start gap-3 transition-all ${
              toast.type === 'success'
                ? 'bg-emerald-950/95 border-emerald-500/60 text-white'
                : toast.type === 'warning'
                ? 'bg-amber-950/95 border-amber-500/60 text-white'
                : 'bg-slate-900/95 border-slate-700 text-white'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : toast.type === 'warning' ? (
                <AlertCircle className="w-5 h-5 text-amber-400" />
              ) : (
                <Info className="w-5 h-5 text-cyan-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h5 className="text-xs font-bold leading-tight">{toast.title}</h5>
                <span className="text-[10px] text-slate-400 font-mono">
                  {toast.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">{toast.message}</p>
            </div>

            <button
              onClick={() => dismissNotification(toast.id)}
              className="text-slate-400 hover:text-white shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
