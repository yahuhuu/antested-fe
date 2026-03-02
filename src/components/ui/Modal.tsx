import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2, Minimize2, ArrowLeft } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, footer, className }: ModalProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsFullScreen(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
          />
          <motion.div
            key="modal"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={
              isFullScreen
                ? { 
                    scale: 1, 
                    opacity: 1, 
                    y: 0,
                    width: 'calc(100vw - 32px)',
                    height: 'calc(100vh - 32px)',
                    maxWidth: '100vw',
                    maxHeight: '100vh',
                    borderRadius: '16px'
                  }
                : { 
                    scale: 1, 
                    opacity: 1, 
                    y: 0,
                    width: '100%',
                    height: 'auto',
                    maxWidth: '', // Let class handle it
                    maxHeight: '90vh',
                    borderRadius: '12px'
                  }
            }
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative flex flex-col border border-border bg-surface shadow-2xl pointer-events-auto overflow-hidden",
              !isFullScreen && "w-full max-w-md", // Default max-w-md if no className provided
              !isFullScreen && className
            )}
          >
            <div className="flex items-center justify-between p-6 pb-4 border-b border-border shrink-0 bg-surface/80 backdrop-blur-md z-10 sticky top-0">
              <div className="flex items-center gap-3">
                {isFullScreen && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFullScreen(false)}
                    className="h-8 w-8 text-text-muted hover:text-text"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <h2 className="text-lg font-semibold text-text">{title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="h-8 w-8 text-text-muted hover:text-text"
                  title={isFullScreen ? "Minimize" : "Open Full Page"}
                >
                  {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClose} 
                  className="h-8 w-8 text-text-muted hover:text-text"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 pt-4 overflow-y-auto custom-scrollbar flex-1 relative" id="modal-body">
              {children}
            </div>
            {footer && (
              <div className="p-6 pt-4 border-t border-border shrink-0 bg-surface/80 backdrop-blur-md z-10 sticky bottom-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
