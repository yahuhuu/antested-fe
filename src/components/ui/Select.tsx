import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options?: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, value, onChange, placeholder = 'Select option...', disabled, required, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options?.find(opt => opt.value === value);

    return (
      <div className="relative w-full" ref={containerRef}>
        {/* Hidden native select for form submission and required validation */}
        <select
          ref={ref}
          className="sr-only"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          required={required}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            'flex h-9 w-full items-center justify-between rounded-md border border-border bg-background px-3 py-1 text-sm text-text shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          disabled={disabled}
        >
          <span className={cn("truncate", !selectedOption && "text-text-muted")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-surface py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm custom-scrollbar">
            {options?.map((option) => (
              <div
                key={option.value}
                className={cn(
                  'relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-surface-hover text-text',
                  value === option.value ? 'bg-primary/10 text-primary' : ''
                )}
                onClick={() => {
                  onChange?.(option.value);
                  setIsOpen(false);
                }}
              >
                <span className={cn('block truncate', value === option.value ? 'font-semibold' : 'font-normal')}>
                  {option.label}
                </span>
              </div>
            ))}
            {(!options || options.length === 0) && (
              <div className="py-2 pl-3 pr-9 text-text-muted">No options available</div>
            )}
          </div>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };
