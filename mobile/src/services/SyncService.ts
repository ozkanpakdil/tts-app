import NetInfo from '@react-native-community/netinfo';
import auth from '@react-native-firebase/auth';
import { useSettingsStore } from '../store/useStore';

const API_BASE_URL = 'http://localhost:8080/api'; // Adjust for your environment

class SyncService {
  private static instance: SyncService;
  private isSyncing = false;

  private constructor() {
    this.init();
  }

  public static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  private init() {
    NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        this.processQueue();
      }
    });
  }

  public async processQueue() {
    if (this.isSyncing) return;
    
    const queue = useSettingsStore.getState().syncQueue;
    if (queue.length === 0) return;

    this.isSyncing = true;
    console.log('Processing sync queue:', queue.length, 'items');

    try {
      const user = auth().currentUser;
      if (!user) {
        this.isSyncing = false;
        return;
      }

      const token = await user.getIdToken();

      // For simplicity, we'll just sync the final state of preferences if that's what's in the queue
      // or process each action. Here we'll just sync the current preferences to the backend.
      
      const settings = useSettingsStore.getState();
      
      const response = await fetch(`${API_BASE_URL}/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          language: settings.language,
          voiceId: settings.voiceId,
          rate: settings.rate,
          pitch: settings.pitch,
          darkMode: settings.theme === 'dark',
        }),
      });

      if (response.ok) {
        console.log('Sync successful');
        useSettingsStore.getState().clearSyncQueue();
      } else {
        console.error('Sync failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error during sync:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  public queueSync() {
    useSettingsStore.getState().addToSyncQueue({ type: 'SYNC_PREFERENCES', timestamp: Date.now() });
    this.processQueue(); // Try to process immediately if online
  }
}

export default SyncService.getInstance();