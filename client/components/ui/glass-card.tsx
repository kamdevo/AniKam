import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hover' | 'glow' | 'elevated';
  elevation?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', elevation, children, ...props }, ref) => {
    // Auto-determine elevation based on variant if not explicitly set
    const effectiveElevation = elevation || (variant === 'elevated' ? 3 : 2);

    return (
      <div
        ref={ref}
        className={cn(
          'glass-card transition-all duration-300',
          `elevation-${effectiveElevation}`,
          {
            'elevation-interactive': variant === 'hover',
            'animate-glow': variant === 'glow',
            'elevation-3': variant === 'elevated',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export { GlassCard };
