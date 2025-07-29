import { useState } from 'react';
import { ChevronDown, Play, Check, Pause, Clock } from 'lucide-react';
import { Button } from './button';
import { UserStatus, getUserStatusLabel } from '@shared/anime';
import { cn } from '@/lib/utils';

interface StatusSelectorProps {
  currentStatus?: UserStatus;
  onStatusChange: (status: UserStatus) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact';
  className?: string;
}

const statusIcons = {
  watching: Play,
  completed: Check,
  paused: Pause,
  planning: Clock
};

const statusColors = {
  watching: 'bg-green-500/20 text-green-300 border-green-500/30',
  completed: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  paused: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  planning: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
};

export function StatusSelector({ 
  currentStatus, 
  onStatusChange, 
  size = 'md', 
  variant = 'default',
  className 
}: StatusSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const statuses: UserStatus[] = ['watching', 'completed', 'paused', 'planning'];

  const handleStatusSelect = (status: UserStatus) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  if (variant === 'compact') {
    return (
      <div className="flex gap-1">
        {statuses.map((status) => {
          const Icon = statusIcons[status];
          const isActive = currentStatus === status;
          
          return (
            <Button
              key={status}
              size="sm"
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-8 h-8 p-0",
                isActive && statusColors[status],
                className
              )}
              onClick={() => handleStatusSelect(status)}
              title={getUserStatusLabel(status)}
            >
              <Icon className="w-3 h-3" />
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        className={cn(
          "justify-between",
          currentStatus && statusColors[currentStatus],
          size === 'sm' && "h-8 px-3 text-xs",
          size === 'lg' && "h-12 px-6 text-base",
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {currentStatus && (
            <>
              {(() => {
                const Icon = statusIcons[currentStatus];
                return <Icon className="w-4 h-4" />;
              })()}
              <span>{getUserStatusLabel(currentStatus)}</span>
            </>
          )}
          {!currentStatus && <span>Add to Library</span>}
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform",
          isOpen && "rotate-180"
        )} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-card border border-border rounded-lg shadow-lg overflow-hidden animate-fade-in">
            {statuses.map((status) => {
              const Icon = statusIcons[status];
              
              return (
                <button
                  key={status}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent transition-colors",
                    currentStatus === status && "bg-accent"
                  )}
                  onClick={() => handleStatusSelect(status)}
                >
                  <Icon className="w-4 h-4" />
                  <span>{getUserStatusLabel(status)}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
