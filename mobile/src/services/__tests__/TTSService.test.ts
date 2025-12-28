import TTSService from '../TTSService';
import Tts from 'react-native-tts';

jest.mock('react-native-tts', () => ({
  getInitStatus: jest.fn().mockResolvedValue('success'),
  addEventListener: jest.fn(),
  setDefaultLanguage: jest.fn(),
  setDefaultRate: jest.fn(),
  setDefaultPitch: jest.fn(),
  speak: jest.fn(),
  stop: jest.fn(),
  voices: jest.fn().mockResolvedValue([]),
  setDefaultVoice: jest.fn(),
}));

jest.mock('@react-native-firebase/auth', () => ({
  __esModule: true,
  default: () => ({
    currentUser: {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    },
  }),
}));

jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/mock/path',
  readFile: jest.fn(),
}));

jest.mock('react-native-blob-util', () => ({
  __esModule: true,
  default: {
    config: jest.fn().mockReturnValue({
      fetch: jest.fn().mockResolvedValue({
        respInfo: { status: 200 },
      }),
    }),
  }
}));

describe('TTSService', () => {
  it('should call Tts.speak when speak is called', () => {
    TTSService.speak('Hello');
    expect(Tts.stop).toHaveBeenCalled();
    expect(Tts.speak).toHaveBeenCalledWith('Hello');
  });

  it('should call Tts.stop when stop is called', () => {
    TTSService.stop();
    expect(Tts.stop).toHaveBeenCalled();
  });

  it('should call Tts.setDefaultLanguage when setLanguage is called', () => {
    TTSService.setLanguage('en-GB');
    expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('en-GB');
  });
});
