import { revalidateAllPaths } from './cache-utils';

class RevalidationService {
  private intervalId: NodeJS.Timeout | null = null;
  private readonly INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

  start() {
    if (this.intervalId) {
      console.log('Revalidation service is already running');
      return;
    }

    console.log(
      'Starting periodic cache revalidation service (30 min intervals)'
    );

    this.intervalId = setInterval(() => {
      console.log('Running periodic cache revalidation...');
      revalidateAllPaths();
    }, this.INTERVAL_MS);

    // Run initial revalidation
    revalidateAllPaths();
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Stopped periodic cache revalidation service');
    }
  }

  // Manual trigger for immediate revalidation
  triggerRevalidation() {
    console.log('Manual cache revalidation triggered');
    revalidateAllPaths();
  }
}

// Export singleton instance
export const revalidationService = new RevalidationService();
