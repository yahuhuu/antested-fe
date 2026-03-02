import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, ChevronDown, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface Option {
  id: string;
  name: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selectedIds,
  onChange,
  placeholder = 'Add item...',
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const [maxHeight, setMaxHeight] = useState<number>(200);

  const selectedOptions = options.filter((opt) => selectedIds.includes(opt.id));
  const unselectedOptions = options.filter((opt) => !selectedIds.includes(opt.id));

  const handleRemove = (id: string) => {
    onChange(selectedIds.filter((selectedId) => selectedId !== id));
  };

  const handleAdd = (id: string) => {
    onChange([...selectedIds, id]);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const getScrollParent = (node: HTMLElement | null): HTMLElement | null => {
        if (!node) return null;
        if (node.id === 'modal-body' || node.id === 'side-panel-body') {
          return node;
        }
        if (node.scrollHeight > node.clientHeight && window.getComputedStyle(node).overflowY !== 'visible') {
          return node;
        }
        return getScrollParent(node.parentElement);
      };

      const scrollParent = getScrollParent(dropdownRef.current);

      const updatePosition = () => {
        if (!dropdownRef.current) return;
        const rect = dropdownRef.current.getBoundingClientRect();

        if (scrollParent) {
          const parentRect = scrollParent.getBoundingClientRect();
          const spaceBelow = parentRect.bottom - rect.bottom;
          const spaceAbove = rect.top - parentRect.top;

          if (spaceBelow < 200 && spaceAbove > spaceBelow) {
            setDropdownPosition('top');
            setMaxHeight(Math.max(100, Math.min(spaceAbove - 8, 250)));
          } else {
            setDropdownPosition('bottom');
            setMaxHeight(Math.max(100, Math.min(spaceBelow - 8, 250)));
          }
        } else {
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;
          if (spaceBelow < 200 && spaceAbove > spaceBelow) {
            setDropdownPosition('top');
            setMaxHeight(Math.max(100, Math.min(spaceAbove - 8, 250)));
          } else {
            setDropdownPosition('bottom');
            setMaxHeight(Math.max(100, Math.min(spaceBelow - 8, 250)));
          }
        }
      };

      updatePosition();

      if (scrollParent) {
        scrollParent.addEventListener('scroll', updatePosition);
      }
      window.addEventListener('resize', updatePosition);

      return () => {
        if (scrollParent) {
          scrollParent.removeEventListener('scroll', updatePosition);
        }
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <div className="border border-border rounded-lg bg-surface overflow-hidden flex flex-col">
        {/* Selected Items */}
        {selectedOptions.length > 0 && (
          <div className="flex flex-col">
            {selectedOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between px-4 py-3 border-b border-border group"
              >
                <span className="text-sm font-medium text-text">{option.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(option.id)}
                  className="text-text-muted hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Dropdown Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={unselectedOptions.length === 0}
          className={cn(
            "flex items-center justify-between w-full px-4 py-3 text-sm text-text-muted hover:bg-surface-hover transition-colors text-left outline-none",
            unselectedOptions.length === 0 && "opacity-50 cursor-not-allowed",
            isOpen && "ring-1 ring-primary bg-surface-hover z-10"
          )}
        >
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {placeholder}
          </span>
          <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
        </button>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && unselectedOptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: dropdownPosition === 'top' ? 5 : -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: dropdownPosition === 'top' ? 5 : -5 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-20 w-full bg-surface border border-border rounded-lg shadow-lg overflow-hidden",
              dropdownPosition === 'top' ? "bottom-full mb-1" : "top-full mt-1"
            )}
          >
            <div className="overflow-y-auto py-1 custom-scrollbar" style={{ maxHeight: `${maxHeight}px` }}>
              {unselectedOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleAdd(option.id)}
                  className="w-full px-4 py-2.5 text-sm text-left text-text hover:bg-surface-hover transition-colors"
                >
                  {option.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
