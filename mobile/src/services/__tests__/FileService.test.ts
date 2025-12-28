import FileService from '../FileService';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

jest.mock('react-native-document-picker', () => ({
  pickSingle: jest.fn(),
  types: {
    plainText: 'text/plain',
    pdf: 'application/pdf',
  },
  isCancel: jest.fn(),
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
  exists: jest.fn(),
  mkdir: jest.fn(),
  copyFile: jest.fn(),
  unlink: jest.fn(),
}));

describe('FileService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should pick a document', async () => {
    const mockFile = { name: 'test.txt', uri: 'file://test.txt', type: 'text/plain' };
    (DocumentPicker.pickSingle as jest.Mock).mockResolvedValue(mockFile);

    const result = await FileService.pickDocument();

    expect(DocumentPicker.pickSingle).toHaveBeenCalledWith({
      type: [
        'text/plain', 
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ],
    });
    expect(result).toEqual(mockFile);
  });

  it('should read a file', async () => {
    const mockContent = 'Hello World';
    (RNFS.readFile as jest.Mock).mockResolvedValue(mockContent);

    const result = await FileService.readFile('file://test.txt');

    expect(RNFS.readFile).toHaveBeenCalledWith('file://test.txt', 'utf8');
    expect(result).toEqual(mockContent);
  });

  it('should save to internal storage', async () => {
    (RNFS.exists as jest.Mock).mockResolvedValue(true);
    (RNFS.copyFile as jest.Mock).mockResolvedValue(undefined);

    const result = await FileService.saveToInternalStorage('content://test.txt', 'test.txt');

    expect(RNFS.copyFile).toHaveBeenCalled();
    expect(result).toContain('test.txt');
  });

  it('should delete a file', async () => {
    (RNFS.exists as jest.Mock).mockResolvedValue(true);
    (RNFS.unlink as jest.Mock).mockResolvedValue(undefined);

    await FileService.deleteFile('file://test.txt');

    expect(RNFS.unlink).toHaveBeenCalledWith('file://test.txt');
  });

  it('should extract text from backend', async () => {
    (fetch as any) = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ text: 'extracted text' }),
    });

    const result = await FileService.extractTextFromBackend('file://test.pdf', 'test.pdf', 'application/pdf');

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/files/extract-text'), expect.any(Object));
    expect(result).toEqual('extracted text');
  });
});
