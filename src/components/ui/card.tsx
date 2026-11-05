import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('rounded-2xl border bg-card p-6 text-foreground shadow-sm', className)} {...props} />,
);
Card.displayName = 'Card';
