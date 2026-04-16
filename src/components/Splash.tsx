import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashProps {
  onFinish: () => void;
}

const Splash: React.FC<SplashProps> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    // Safety fallback: always call onFinish after 4s even if animation fails
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 4000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={(definition) => {
            if (definition === 'exit' || (definition as any)?.opacity === 0) {
              onFinish();
            }
          }}
          className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 text-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="w-32 h-32 bg-gov-green/10 rounded-full flex items-center justify-center mb-4 shadow-xl shadow-gov-green/5 border border-gov-green/20">
              <svg viewBox="0 0 100 100" className="w-24 h-24" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" rx="50" fill="#1B5E20"/>
                <text y=".85em" x=".1em" fontSize="70">🇾🇪</text>
              </svg>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h1 className="text-2xl font-bold text-gov-green mb-2">الهيئة العامة للتأمينات والمعاشات</h1>
            <p className="text-gov-text-secondary text-sm tracking-widest uppercase">فرع تَعِز - الجمهورية اليمنية</p>
          </motion.div>

          <motion.div 
            className="absolute bottom-12 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden mb-4">
              <motion.div 
                className="h-full bg-gov-green"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              />
            </div>
            <p className="text-[10px] text-gov-text-secondary font-mono">جاري تحميل الخدمات الرقمية...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Splash;
