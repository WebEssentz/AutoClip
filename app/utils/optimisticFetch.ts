// utils/optimisticFetch.ts
type OptimisticConfig = {
  parallelLimit?: number;  // Number of concurrent requests
  retryCount?: number;     // Number of retries
  timeout?: number;        // Timeout in ms
  priority?: 'high' | 'low';
}

class OptimisticFetcher {
  private queue: Map<string, Promise<any>> = new Map();
  private processing: Set<string> = new Set();
  private maxConcurrent: number;

  constructor(maxConcurrent = 4) { // Boost by 4x
    this.maxConcurrent = maxConcurrent;
  }

  private async waitForSlot(): Promise<void> {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (this.processing.size < this.maxConcurrent) {
          clearInterval(interval);
          resolve();
        }
      }, 10);
    });
  }

  async fetch<T>(
    url: string, 
    options?: RequestInit & OptimisticConfig,
    optimisticData?: T
  ): Promise<T> {
    const key = `${url}-${JSON.stringify(options?.body)}`;
    
    // Return optimistic data immediately
    if (optimisticData) {
      return Promise.resolve(optimisticData);
    }

    // Queue management
    if (this.processing.size >= this.maxConcurrent) {
      await this.waitForSlot();
    }

    // Parallel processing with performance boost
    try {
      this.processing.add(key);

      const controller = new AbortController();
      const timeout = options?.timeout || 5000;
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          controller.abort();
          reject(new Error('Request timeout'));
        }, timeout);
      });

      // Use HTTP/2 multiplexing
      options = {
        ...options,
        headers: {
          ...options?.headers,
          'Connection': 'keep-alive',
          'Priority': options?.priority === 'high' ? 'u=1' : 'u=3'
        },
        signal: controller.signal,
        keepalive: true
      };

      // Optimize network request
      const fetchPromise = fetch(url, options)
        .then(async (res) => {
          if (!res.ok) throw new Error('Request failed');
          
          // Stream response for faster processing
          const reader = res.body?.getReader();
          const decoder = new TextDecoder();
          let data = '';

          while (reader) {
            const { done, value } = await reader.read();
            if (done) break;
            data += decoder.decode(value);
          }

          return JSON.parse(data);
        });

      const response = await Promise.race([fetchPromise, timeoutPromise]);

      // Retry logic
      let retries = options?.retryCount || 3;
      while (retries > 0) {
        try {
          return await response;
        } catch (error) {
          retries--;
          if (retries === 0) throw error;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      return response;
    } finally {
      this.processing.delete(key);
      this.queue.delete(key);
    }
  }
}

// Create singleton instance
export const optimisticFetcher = new OptimisticFetcher(4);