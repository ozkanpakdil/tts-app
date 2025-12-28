import Tts from 'react-native-tts';
import auth from '@react-native-firebase/auth';
import RNFS from 'react-native-fs';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { Platform } from 'react-native';

const API_BASE_URL = 'http://localhost:8080/api'; // Adjust for your environment

class TTSService {
  private static instance: TTSService;

  private constructor() {
    this.init();
  }

  public static getInstance(): TTSService {
    if (!TTSService.instance) {
      TTSService.instance = new TTSService();
    }
    return TTSService.instance;
  }

  private init() {
    Tts.getInitStatus().then(
      () => {
        console.log('TTS Initialized');
        try {
          Tts.setDefaultLanguage('en-US');
        } catch (error) {
          console.warn('TTS setDefaultLanguage error during init:', error);
        }
        // On iOS, setDefaultRate may cause issues - wrap in try-catch
        try {
          if (Platform.OS === 'ios') {
            Tts.setDefaultRate(0.5);
          } else {
            Tts.setDefaultRate(0.5, false);
          }
        } catch (error) {
          console.warn('TTS setDefaultRate error during init:', error);
        }
      },
      (err) => {
        if (err.code === 'no_engine') {
          Tts.requestInstallEngine();
        }
        console.error('TTS Init Error:', err);
      }
    );

    Tts.addEventListener('tts-start', (event) => console.log('TTS started', event));
    Tts.addEventListener('tts-finish', (event) => console.log('TTS finished', event));
    Tts.addEventListener('tts-cancel', (event) => console.log('TTS cancelled', event));
  }

  public speak(text: string) {
    try {
      // Stop any ongoing speech before starting new one
      // Wrap in separate try-catch as iOS may throw errors
      try {
        Tts.stop();
      } catch (stopError) {
        console.warn('TTS stop error (continuing):', stopError);
      }
      Tts.speak(text);
    } catch (error) {
      console.error('TTS speak error:', error);
    }
  }

  public stop() {
    try {
      Tts.stop();
    } catch (error) {
      console.warn('TTS stop error:', error);
    }
  }

  public async getVoices() {
    return await Tts.voices();
  }

  public async getCloudVoices(provider: string): Promise<any[]> {
    try {
      const user = auth().currentUser;
      const token = await user?.getIdToken();
      
      const res = await fetch(`${API_BASE_URL}/voices/${provider}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      
      if (!res.ok) throw new Error('Failed to fetch cloud voices');
      return await res.json();
    } catch (error) {
      console.error('Error fetching cloud voices:', error);
      return [];
    }
  }

  public setLanguage(language: string) {
    try {
      Tts.setDefaultLanguage(language);
    } catch (error) {
      console.warn('TTS setLanguage error:', error);
    }
  }

  public setVoice(voiceId: string) {
    try {
      (Tts as any).setDefaultVoice(voiceId);
    } catch (error) {
      console.warn('TTS setVoice error:', error);
    }
  }

  public setRate(rate: number) {
    // On iOS, setDefaultRate may not work reliably in all versions
    // Wrap in try-catch to prevent blocking TTS functionality
    try {
      if (Platform.OS === 'ios') {
        // iOS: only pass the rate parameter
        Tts.setDefaultRate(rate);
      } else {
        // Android: pass rate and skipTransform
        Tts.setDefaultRate(rate, false);
      }
    } catch (error) {
      console.warn('TTS setRate error:', error);
    }
  }

  public setPitch(pitch: number) {
    try {
      Tts.setDefaultPitch(pitch);
    } catch (error) {
      console.warn('TTS setPitch error:', error);
    }
  }

  public requestInstallEngine() {
    Tts.requestInstallEngine();
  }

  public async synthesizeToFile(text: string, filename: string): Promise<string> {
    // Tts.synthesizeToFile is available on Android. 
    // For iOS, react-native-tts might have different support or we use a workaround.
    // In many RN TTS libs, it returns the URI of the saved file.
    try {
      const uri = await (Tts as any).synthesizeToFile(text, filename);
      return uri;
    } catch (error) {
      console.error('TTS Synthesis to file error:', error);
      throw error;
    }
  }

  public async speakCloud(text: string, provider: string, options: any): Promise<string> {
    try {
      const user = auth().currentUser;
      if (!user) throw new Error('User not authenticated');

      const token = await user.getIdToken();
      const timestamp = Date.now();
      const destPath = `${RNFS.DocumentDirectoryPath}/cloud_tts_${timestamp}.mp3`;
      
      const res = await ReactNativeBlobUtil.config({
        path: destPath,
      }).fetch('POST', `${API_BASE_URL}/tts/synthesize`, {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }, JSON.stringify({
        text,
        provider,
        voiceId: options.voiceId,
        languageCode: options.languageCode,
        speakingRate: options.rate,
        pitch: options.pitch,
        audioQuality: options.audioQuality,
      }));

      if (res.respInfo.status !== 200) {
        throw new Error('Cloud TTS request failed with status ' + res.respInfo.status);
      }

      return destPath; 
    } catch (error) {
      console.error('Cloud TTS Error:', error);
      throw error;
    }
  }
}

export default TTSService.getInstance();
