import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2, Minimize2, ArrowLeft } from 'lucide-react';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  defaultWidth?: number;
}

export function SidePanel({ isOpen, onClose, title, children, footer, defaultWidth = 420 }: SidePanelProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [panelWidth, setPanelWidth] = useState(defaultWidth);
  const [isDragging, setIsDragging] = useState(false);
  const isResizing = useRef(false);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isFullScreen) return;
    isResizing.current = true;
    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;
    requestAnimationFrame(() => {
      const newWidth = window.innerWidth - e.clientX - 16;
      if (newWidth > 300 && newWidth < window.innerWidth - 32) {
        setPanelWidth(newWidth);
      }
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    isResizing.current = false;
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
  }, [handleMouseMove]);

  const panelContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-[2px]"
          />
          <motion.div
            key="panel"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ 
              x: 0, 
              opacity: 1,
              width: isFullScreen ? 'calc(100vw - 32px)' : panelWidth,
              right: 16,
              top: 16,
              bottom: 16,
              borderRadius: '16px'
            }}
            exit={{ x: '100%', opacity: 0 }}
            transition={
              isDragging 
                ? { type: 'tween', duration: 0 } 
                : { type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }
            }
            style={{
              position: 'fixed',
              zIndex: 101,
            }}
            className="bg-surface flex flex-col overflow-hidden border border-border/50 shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] ring-1 ring-black/5 dark:ring-white/5"
          >
            {/* Drag Handle */}
            {!isFullScreen && (
              <div
                className="absolute left-0 top-0 bottom-0 w-4 cursor-col-resize hover:bg-primary/10 transition-colors z-20 flex items-center justify-center group"
                onMouseDown={handleMouseDown}
              >
                <div className="w-1 h-8 bg-border group-hover:bg-primary rounded-full transition-colors" />
              </div>
            )}

            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {isFullScreen && (
                  <button
                    onClick={() => setIsFullScreen(false)}
                    className="p-1.5 rounded-md hover:bg-background text-text-muted hover:text-text transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <h2 className="text-sm font-semibold text-text uppercase tracking-wider">{title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="p-1.5 rounded-md hover:bg-background text-text-muted hover:text-text transition-colors"
                  title={isFullScreen ? "Minimize" : "Open Full Page"}
                >
                  {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-md hover:bg-background text-text-muted hover:text-text transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar relative p-6" id="side-panel-body">
              {children}
            </div>

            {/* Sticky Footer */}
            {footer && (
              <div className="sticky bottom-0 z-10 bg-surface/80 backdrop-blur-md border-t border-border px-6 py-4 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(panelContent, document.body);
}
