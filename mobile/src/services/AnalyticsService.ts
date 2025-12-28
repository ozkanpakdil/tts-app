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
}

export default new AnalyticsService();
