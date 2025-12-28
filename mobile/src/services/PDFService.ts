import * as pdfjs from 'pdfjs-dist';
import ReactNativeBlobUtil from 'react-native-blob-util';

// Set worker path - this is tricky in React Native
// For now we'll try without explicit worker or with a local one if needed.
// pdfjs.GlobalWorkerOptions.workerSrc = ...

class PDFService {
  public async extractText(uri: string): Promise<string> {
    try {
      // Get file as base64
      const b64 = await ReactNativeBlobUtil.fs.readFile(uri, 'base64');
      
      // Convert base64 to Uint8Array
      const binaryString = ReactNativeBlobUtil.base64.decode(b64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const loadingTask = pdfjs.getDocument({ data: bytes });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n\n';
      }
      
      return fullText;
    } catch (error) {
      console.error('PDF Extraction Error:', error);
      throw error;
    }
  }
}

export default new PDFService();
