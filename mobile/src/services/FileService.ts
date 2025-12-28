import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import auth from '@react-native-firebase/auth';

const API_BASE_URL = 'http://localhost:8080/api'; // Adjust for your environment

class FileService {
  public async pickDocument(): Promise<DocumentPickerResponse | null> {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [
          DocumentPicker.types.plainText, 
          DocumentPicker.types.pdf,
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
        ],
      });
      return res;
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('DocumentPicker Error:', err);
      }
      return null;
    }
  }

  public async readFile(uri: string): Promise<string> {
    try {
      // Decode URI for some systems
      const decodedUri = decodeURIComponent(uri);
      
      // On Android, we might need to copy the file to a cache directory first 
      // if it's from a content provider, but react-native-fs can sometimes 
      // read content:// uris directly or we might need a different approach.
      
      const content = await RNFS.readFile(decodedUri, 'utf8');
      return content;
    } catch (err) {
      console.error('ReadFile Error:', err);
      throw err;
    }
  }

  public async saveToInternalStorage(uri: string, filename: string): Promise<string> {
    try {
      const docsDir = `${RNFS.DocumentDirectoryPath}/documents`;
      const dirExists = await RNFS.exists(docsDir);
      if (!dirExists) {
        await RNFS.mkdir(docsDir);
      }
      
      const destPath = `${docsDir}/${Date.now()}_${filename}`;
      
      // For content:// URIs on Android, copyFile is usually supported by RNFS if used correctly
      await RNFS.copyFile(uri, destPath);
      return destPath;
    } catch (err) {
      console.error('SaveToInternalStorage Error:', err);
      throw err;
    }
  }

  public async deleteFile(uri: string): Promise<void> {
    try {
      if (await RNFS.exists(uri)) {
        await RNFS.unlink(uri);
      }
    } catch (err) {
      console.error('DeleteFile Error:', err);
      throw err;
    }
  }

  public async extractTextFromBackend(uri: string, name: string, type: string): Promise<string> {
    try {
      const user = auth().currentUser;
      const token = await user?.getIdToken();
      
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        name: name,
        type: type,
      } as any);

      const response = await fetch(`${API_BASE_URL}/files/extract-text`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extract text from backend');
      }

      const data = await response.json();
      return data.text;
    } catch (err) {
      console.error('ExtractTextFromBackend Error:', err);
      throw err;
    }
  }
}

export default new FileService();
