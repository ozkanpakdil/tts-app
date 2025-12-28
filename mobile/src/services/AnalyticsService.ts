// Using Firebase modular API (v22+)
// See: https://rnfirebase.io/migrating-to-v22
import { getAnalytics, logEvent, setUserId, logScreenView } from '@react-native-firebase/analytics';
import { getCrashlytics, log, recordError, setUserId as setCrashlyticsUserId } from '@react-native-firebase/crashlytics';

class AnalyticsService {
  public async logEvent(name: string, params?: Record<string, any>) {
    try {
      const analytics = getAnalytics();
      await logEvent(analytics, name, params);
    } catch (error) {
      console.error('Analytics logEvent error:', error);
    }
  }

  public async setUserId(userId: string | null) {
    try {
      const analytics = getAnalytics();
      await setUserId(analytics, userId);
      if (userId) {
        const crashlyticsInstance = getCrashlytics();
        await setCrashlyticsUserId(crashlyticsInstance, userId);
      }
    } catch (error) {
      console.error('Analytics setUserId error:', error);
    }
  }

  public logError(error: Error, message?: string) {
    try {
      const crashlyticsInstance = getCrashlytics();
      if (message) {
        log(crashlyticsInstance, message);
      }
      recordError(crashlyticsInstance, error);
    } catch (e) {
      console.error('Crashlytics recordError failed:', e);
    }
  }

  public async logScreenView(screenName: string, screenClass?: string) {
    try {
      const analytics = getAnalytics();
      await logScreenView(analytics, {
        screen_name: screenName,
        screen_class: screenClass || screenName,
      });
    } catch (error) {
      console.error('Analytics logScreenView error:', error);
    }
  }

  public async startTrace(traceName: string) {
    // For now we just log a custom event as a simple performance marker
    // Full Firebase Performance Monitoring would require another package
    await this.logEvent(`perf_trace_start_${traceName}`);
  }

  public async stopTrace(traceName: string) {
    await this.logEvent(`perf_trace_stop_${traceName}`);
  }
}

export default new AnalyticsService();
