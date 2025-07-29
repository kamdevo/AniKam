import { useState, useEffect } from 'react';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface ApiStatusNotificationProps {
  show: boolean;
  type: 'offline' | 'rate-limited' | 'cached';
  onDismiss?: () => void;
}

export function ApiStatusNotification({ show, type, onDismiss }: ApiStatusNotificationProps) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    if (show && onDismiss) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss();
      }, 5000); // Auto dismiss after 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [show, onDismiss]);

  if (!isVisible) return null;

  const getContent = () => {
    switch (type) {
      case 'offline':
        return {
          icon: <WifiOff className="w-4 h-4" />,
          title: 'API Temporarily Unavailable',
          description: 'Showing cached content. Some data may be outdated.',
          className: 'border-yellow-500/50 bg-yellow-500/10'
        };
      case 'rate-limited':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          title: 'API Rate Limited',
          description: 'Using cached data to avoid overloading MyAnimeList servers.',
          className: 'border-orange-500/50 bg-orange-500/10'
        };
      case 'cached':
        return {
          icon: <Wifi className="w-4 h-4" />,
          title: 'Using Cached Data',
          description: 'Content loaded from cache for faster performance.',
          className: 'border-blue-500/50 bg-blue-500/10'
        };
      default:
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          title: 'API Status',
          description: 'Unknown status',
          className: 'border-gray-500/50 bg-gray-500/10'
        };
    }
  };

  const content = getContent();

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm animate-fade-in">
      <Alert className={cn('glass-card', content.className)}>
        <div className="flex items-start gap-3">
          {content.icon}
          <div className="flex-1">
            <h4 className="text-sm font-medium">{content.title}</h4>
            <AlertDescription className="text-xs mt-1">
              {content.description}
            </AlertDescription>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              onDismiss?.();
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        </div>
      </Alert>
    </div>
  );
}
