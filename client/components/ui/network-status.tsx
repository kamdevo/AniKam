import { useState, useEffect } from "react";
import { Wifi, WifiOff, AlertTriangle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "./alert";
import { Button } from "./button";
import { networkMonitor, NetworkStatus } from "@/lib/network-utils";

export function NetworkStatusNotification() {
  const [status, setStatus] = useState<NetworkStatus>(
    networkMonitor.getStatus(),
  );
  const [showNotification, setShowNotification] = useState(false);
  const [lastOfflineTime, setLastOfflineTime] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = networkMonitor.subscribe((newStatus) => {
      const wasOffline = !status.isOnline;
      const isNowOnline = newStatus.isOnline;

      setStatus(newStatus);

      // Show notification when going offline or coming back online
      if (!isNowOnline && status.isOnline) {
        // Just went offline
        setLastOfflineTime(Date.now());
        setShowNotification(true);
      } else if (isNowOnline && wasOffline) {
        // Just came back online
        setShowNotification(true);
        // Auto-hide after 3 seconds when back online
        setTimeout(() => setShowNotification(false), 3000);
      }
    });

    return unsubscribe;
  }, [status.isOnline]);

  if (!showNotification) return null;

  const handleDismiss = () => {
    setShowNotification(false);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (!status.isOnline) {
    return (
      <div className="fixed top-16 left-4 right-4 z-50 max-w-md mx-auto">
        <Alert className="bg-destructive/10 border-destructive/20">
          <WifiOff className="h-4 w-4 text-destructive" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <div className="font-medium text-destructive">You're offline</div>
              <div className="text-sm text-muted-foreground">
                Some features may not work properly. Check your internet
                connection.
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDismiss}>
              ×
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (status.isSlowConnection) {
    return (
      <div className="fixed top-16 left-4 right-4 z-50 max-w-md mx-auto">
        <Alert className="bg-warning/10 border-warning/20">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <div className="font-medium text-warning">
                Slow connection detected
              </div>
              <div className="text-sm text-muted-foreground">
                Content may load slower than usual.
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDismiss}>
              ×
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Back online notification
  return (
    <div className="fixed top-16 left-4 right-4 z-50 max-w-md mx-auto">
      <Alert className="bg-success/10 border-success/20">
        <CheckCircle className="h-4 w-4 text-success" />
        <AlertDescription className="flex items-center justify-between">
          <div>
            <div className="font-medium text-success">You're back online!</div>
            <div className="text-sm text-muted-foreground">
              All features are now available.
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleRetry}>
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDismiss}>
              ×
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
