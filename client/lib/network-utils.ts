// Network utilities for better error handling and offline support

export interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  lastCheck: number;
}

class NetworkMonitor {
  private status: NetworkStatus = {
    isOnline: navigator.onLine,
    isSlowConnection: false,
    lastCheck: Date.now(),
  };

  private listeners: ((status: NetworkStatus) => void)[] = [];

  constructor() {
    this.setupEventListeners();
    this.checkConnection();
  }

  private setupEventListeners() {
    window.addEventListener("online", () => {
      this.updateStatus({ isOnline: true, isSlowConnection: false });
    });

    window.addEventListener("offline", () => {
      this.updateStatus({ isOnline: false, isSlowConnection: false });
    });

    // Check connection quality periodically
    setInterval(() => {
      if (this.status.isOnline) {
        this.checkConnection();
      }
    }, 30000); // Check every 30 seconds
  }

  private async checkConnection() {
    try {
      const startTime = Date.now();

      // Try to fetch a small image from a reliable CDN
      const response = await fetch("https://httpbin.org/bytes/1", {
        method: "HEAD",
        cache: "no-cache",
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const isOnline = response.ok;
      const isSlowConnection = responseTime > 3000; // Consider >3s as slow

      this.updateStatus({
        isOnline,
        isSlowConnection,
        lastCheck: endTime,
      });
    } catch (error) {
      this.updateStatus({
        isOnline: false,
        isSlowConnection: false,
        lastCheck: Date.now(),
      });
    }
  }

  private updateStatus(newStatus: Partial<NetworkStatus>) {
    this.status = { ...this.status, ...newStatus };
    this.listeners.forEach((listener) => listener(this.status));
  }

  public getStatus(): NetworkStatus {
    return { ...this.status };
  }

  public subscribe(listener: (status: NetworkStatus) => void): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  public async testApiConnection(apiUrl: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(apiUrl, {
        method: "HEAD",
        signal: controller.signal,
        cache: "no-cache",
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export const networkMonitor = new NetworkMonitor();

export function isNetworkError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes("failed to fetch") ||
    message.includes("network error") ||
    message.includes("networkerror") ||
    message.includes("aborterror") ||
    message.includes("timeout") ||
    message.includes("connection") ||
    message.includes("jikan api request failed")
  );
}

export function getNetworkErrorMessage(error: Error): string {
  if (isNetworkError(error)) {
    if (!navigator.onLine) {
      return "You appear to be offline. Please check your internet connection.";
    }
    return "Unable to connect to the anime database. This might be due to a slow connection or server issues. Please try again.";
  }
  return error.message;
}

export function shouldUseFallbackData(
  error: Error,
  hasExistingData: boolean,
): boolean {
  return (
    isNetworkError(error) || (!hasExistingData && error.message.includes("429"))
  );
}
