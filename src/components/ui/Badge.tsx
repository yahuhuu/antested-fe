import * as React from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends React.ComponentProps<"div"> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        {
          'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary-hover': variant === 'default',
          'border-transparent bg-surface-hover text-text hover:bg-border': variant === 'secondary',
          'border-transparent bg-red-500 text-white shadow hover:bg-red-600': variant === 'destructive',
          'text-text border-border': variant === 'outline',
          'border-transparent bg-emerald-500 text-white shadow hover:bg-emerald-600': variant === 'success',
          'border-transparent bg-amber-500 text-white shadow hover:bg-amber-600': variant === 'warning',
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
