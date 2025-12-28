import Tts from 'react-native-tts';
import auth from '@react-native-firebase/auth';
import RNFS from 'react-native-fs';
import ReactNativeBlobUtil from 'react-native-blob-util';

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
        Tts.setDefaultLanguage('en-US');
        Tts.setDefaultRate(0.5);
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
    Tts.stop();
    Tts.speak(text);
  }

  public stop() {
    Tts.stop();
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
    Tts.setDefaultLanguage(language);
  }

  public setVoice(voiceId: string) {
    (Tts as any).setDefaultVoice(voiceId);
  }

  public setRate(rate: number) {
    Tts.setDefaultRate(rate);
  }

  public setPitch(pitch: number) {
    Tts.setDefaultPitch(pitch);
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
