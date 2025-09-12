/**
 * Request Coalescer Utility
 * 
 * A comprehensive utility for coalescing async requests by key value.
 * This prevents duplicate API calls and improves performance by ensuring
 * that multiple requests for the same resource are batched together.
 */

type PendingRequest<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: any) => void;
  timestamp: number;
  subscribers: Array<{
    resolve: (value: T) => void;
    reject: (error: any) => void;
  }>;
};

type RequestOptions = {
  /** Time in milliseconds after which a pending request expires */
  ttl?: number;
  /** Maximum number of subscribers per request */
  maxSubscribers?: number;
  /** Whether to retry failed requests */
  retryOnFailure?: boolean;
  /** Number of retry attempts */
  maxRetries?: number;
  /** Delay between retries in milliseconds */
  retryDelay?: number;
};

class RequestCoalescer {
  private pendingRequests = new Map<string, PendingRequest<any>>();
  private defaultOptions: Required<RequestOptions> = {
    ttl: 30000, // 30 seconds
    maxSubscribers: 100,
    retryOnFailure: false,
    maxRetries: 3,
    retryDelay: 1000
  };

  constructor(options?: Partial<RequestOptions>) {
    this.defaultOptions = { ...this.defaultOptions, ...options };
    
    // Clean up expired requests every 10 seconds
    setInterval(() => this.cleanup(), 10000);
  }

  /**
   * Coalesce requests by key
   * @param key - Unique identifier for the request
   * @param requestFn - Function that returns a promise
   * @param options - Request options
   */
  async coalesce<T>(
    key: string,
    requestFn: () => Promise<T>,
    options?: RequestOptions
  ): Promise<T> {
    const opts = { ...this.defaultOptions, ...options };
    const existing = this.pendingRequests.get(key);

    if (existing) {
      // Check if request has expired
      if (Date.now() - existing.timestamp > opts.ttl) {
        this.pendingRequests.delete(key);
      } else {
        // Check subscriber limit
        if (existing.subscribers.length >= opts.maxSubscribers) {
          throw new Error(`Maximum subscribers (${opts.maxSubscribers}) reached for key: ${key}`);
        }

        // Subscribe to existing request
        return new Promise<T>((resolve, reject) => {
          existing.subscribers.push({ resolve, reject });
        });
      }
    }

    // Create new request
    return this.createNewRequest(key, requestFn, opts);
  }

  private async createNewRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    options: Required<RequestOptions>
  ): Promise<T> {
    let resolve: (value: T) => void;
    let reject: (error: any) => void;

    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });

    const pendingRequest: PendingRequest<T> = {
      promise,
      resolve: resolve!,
      reject: reject!,
      timestamp: Date.now(),
      subscribers: []
    };

    this.pendingRequests.set(key, pendingRequest);

    try {
      const result = await this.executeWithRetry(requestFn, options);
      
      // Resolve all subscribers
      pendingRequest.resolve(result);
      pendingRequest.subscribers.forEach(sub => sub.resolve(result));
      
      this.pendingRequests.delete(key);
      return result;
    } catch (error) {
      // Reject all subscribers
      pendingRequest.reject(error);
      pendingRequest.subscribers.forEach(sub => sub.reject(error));
      
      this.pendingRequests.delete(key);
      throw error;
    }
  }

  private async executeWithRetry<T>(
    requestFn: () => Promise<T>,
    options: Required<RequestOptions>
  ): Promise<T> {
    let lastError: any;
    let attempts = 0;

    while (attempts <= options.maxRetries) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        attempts++;

        if (!options.retryOnFailure || attempts > options.maxRetries) {
          throw error;
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, options.retryDelay));
      }
    }

    throw lastError;
  }

  /**
   * Cancel a pending request
   * @param key - Request key to cancel
   */
  cancel(key: string): boolean {
    const pending = this.pendingRequests.get(key);
    if (pending) {
      const error = new Error(`Request cancelled: ${key}`);
      pending.reject(error);
      pending.subscribers.forEach(sub => sub.reject(error));
      this.pendingRequests.delete(key);
      return true;
    }
    return false;
  }

  /**
   * Cancel all pending requests
   */
  cancelAll(): void {
    const error = new Error('All requests cancelled');
    this.pendingRequests.forEach((pending, key) => {
      pending.reject(error);
      pending.subscribers.forEach(sub => sub.reject(error));
    });
    this.pendingRequests.clear();
  }

  /**
   * Get information about pending requests
   */
  getStats(): {
    pendingCount: number;
    totalSubscribers: number;
    keys: string[];
  } {
    let totalSubscribers = 0;
    const keys: string[] = [];

    this.pendingRequests.forEach((pending, key) => {
      totalSubscribers += pending.subscribers.length + 1; // +1 for original request
      keys.push(key);
    });

    return {
      pendingCount: this.pendingRequests.size,
      totalSubscribers,
      keys
    };
  }

  /**
   * Check if a request is pending
   * @param key - Request key
   */
  isPending(key: string): boolean {
    return this.pendingRequests.has(key);
  }

  /**
   * Clean up expired requests
   */
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    this.pendingRequests.forEach((pending, key) => {
      if (now - pending.timestamp > this.defaultOptions.ttl) {
        expiredKeys.push(key);
      }
    });

    expiredKeys.forEach(key => {
      const pending = this.pendingRequests.get(key);
      if (pending) {
        const error = new Error(`Request expired: ${key}`);
        pending.reject(error);
        pending.subscribers.forEach(sub => sub.reject(error));
        this.pendingRequests.delete(key);
      }
    });

    if (expiredKeys.length > 0) {
      console.log(`Cleaned up ${expiredKeys.length} expired requests`);
    }
  }
}

// Global instance
export const globalCoalescer = new RequestCoalescer();

// Factory function for creating custom coalescers
export const createCoalescer = (options?: RequestOptions) => {
  return new RequestCoalescer(options);
};

// Convenience function for one-off coalescing
export const coalesceRequest = <T>(
  key: string,
  requestFn: () => Promise<T>,
  options?: RequestOptions
): Promise<T> => {
  return globalCoalescer.coalesce(key, requestFn, options);
};

// Hook for React components
export const useRequestCoalescer = () => {
  return {
    coalesce: globalCoalescer.coalesce.bind(globalCoalescer),
    cancel: globalCoalescer.cancel.bind(globalCoalescer),
    cancelAll: globalCoalescer.cancelAll.bind(globalCoalescer),
    getStats: globalCoalescer.getStats.bind(globalCoalescer),
    isPending: globalCoalescer.isPending.bind(globalCoalescer)
  };
};

export default RequestCoalescer;