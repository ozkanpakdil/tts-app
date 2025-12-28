import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

class AnalyticsService {
  public async logEvent(name: string, params?: object) {
    try {
      await analytics().logEvent(name, params);
    } catch (error) {
      console.error('Analytics logEvent error:', error);
    }
  }

  public async setUserId(userId: string | null) {
    try {
      await analytics().setUserId(userId);
      if (userId) {
        await crashlytics().setUserId(userId);
      }
    } catch (error) {
      console.error('Analytics setUserId error:', error);
    }
  }

  public logError(error: Error, message?: string) {
    if (message) {
      crashlytics().log(message);
    }
    crashlytics().recordError(error);
  }

  public async logScreenView(screenName: string, screenClass?: string) {
    try {
      await analytics().logScreenView({
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
