import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Tts from 'react-native-tts';
import FileService from '../services/FileService';
import TTSService from '../services/TTSService';
import PDFService from '../services/PDFService';
import { useFileStore, useSettingsStore, useAudioStore } from '../store/useStore';
import RNFS from 'react-native-fs';
import AudioPlayer, { AudioPlayerRef } from '../components/AudioPlayer';
import { useOfflineStatus } from '../hooks/useOfflineStatus';

const ReaderScreen = ({ route }: any) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [highlightRange, setHighlightRange] = useState({ start: 0, end: 0 });
  const addRecentFile = useFileStore((state) => state.addRecentFile);
  const addAudio = useAudioStore((state) => state.addAudio);
  const { language, voiceId, rate, pitch, ttsProvider, audioQuality } = useSettingsStore();
  const { bookmarks, addBookmark, removeBookmark } = useFileStore();
  const scrollViewRef = useRef<ScrollView>(null);
  const [exporting, setExporting] = useState(false);
  const [loadingCloud, setLoadingCloud] = useState(false);
  const audioPlayerRef = useRef<AudioPlayerRef>(null);
  const isOffline = useOfflineStatus();

  useEffect(() => {
    let startListener: any;
    let finishListener: any;
    let cancelListener: any;
    let progressListener: any;

    if (ttsProvider === 'on-device') {
        startListener = Tts.addEventListener('tts-start', (event) => {
            setIsSpeaking(true);
        });
        finishListener = Tts.addEventListener('tts-finish', (event) => {
            setIsSpeaking(false);
            setProgress(0);
            setHighlightRange({ start: 0, end: 0 });
        });
        cancelListener = Tts.addEventListener('tts-cancel', (event) => {
            setIsSpeaking(false);
            setHighlightRange({ start: 0, end: 0 });
        });
        progressListener = Tts.addEventListener('tts-progress', (event) => {
            if (content.length > 0) {
                setProgress(event.location / content.length);
                setHighlightRange({ start: event.location, end: event.location + event.length });
            }
        });

        return () => {
            startListener?.remove?.();
            finishListener?.remove?.();
            cancelListener?.remove?.();
            progressListener?.remove?.();
        };
    }
  }, [content, ttsProvider]);

  useEffect(() => {
    if (route.params?.file) {
      loadFile(route.params.file);
    }
  }, [route.params?.file]);

  const loadFile = async (file: { name: string, uri: string, type: string }) => {
    setFileName(file.name);
    setLoading(true);
    try {
      let text = '';
      if (file.type === 'application/pdf') {
        text = await PDFService.extractText(file.uri);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        if (isOffline) {
          throw new Error('Offline DOCX extraction is not supported. Please connect to the internet.');
        }
        text = await FileService.extractTextFromBackend(file.uri, file.name, file.type);
      } else {
        text = await FileService.readFile(file.uri);
      }
      setContent(text);
      addRecentFile({
        ...file,
        lastOpened: Date.now(),
      });
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', 'Failed to read file: ' + err.message);
      setContent('Error reading file.');
    } finally {
      setLoading(false);
    }
  };

  const handlePickFile = async () => {
    const file = await FileService.pickDocument();
    if (file) {
      loadFile({
        name: file.name || 'Unknown',
        uri: file.uri,
        type: file.type || 'text/plain',
      });
    }
  };

  const handleAddBookmark = () => {
    if (!route.params?.file?.uri) return;
    
    const position = highlightRange.start;
    const snippet = content.substring(position, position + 20).replace(/\n/g, ' ') + '...';
    
    Alert.prompt(
      'Add Bookmark',
      'Enter a name for this bookmark',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add', 
          onPress: (name?: string) => {
            addBookmark({
              id: Date.now().toString(),
              fileUri: route.params.file.uri,
              name: name || snippet,
              position,
              createdAt: Date.now(),
            });
          }
        }
      ],
      'plain-text',
      `Bookmark at ${Math.round(progress * 100)}%`
    );
  };

  const handleShowBookmarks = () => {
    const fileBookmarks = bookmarks.filter(b => b.fileUri === route.params?.file?.uri);
    
    if (fileBookmarks.length === 0) {
      Alert.alert('No Bookmarks', 'You haven\'t added any bookmarks for this document yet.');
      return;
    }

    Alert.alert(
      'Bookmarks',
      'Select a bookmark to jump to:',
      fileBookmarks.map(b => ({
        text: b.name,
        onPress: () => {
          setHighlightRange({ start: b.position, end: b.position });
          setProgress(b.position / content.length);
          // Restart speech from here if already speaking?
          if (isSpeaking) {
            handleStop();
            setTimeout(() => {
                const remainingText = content.substring(b.position);
                if (ttsProvider === 'on-device') {
                    TTSService.speak(remainingText);
                }
            }, 500);
          }
        }
      })).concat([{ text: 'Close', style: 'cancel' }] as any)
    );
  };

  const handleSpeak = async () => {
    if (content) {
      const textToSpeak = highlightRange.start > 0 ? content.substring(highlightRange.start) : content;
      
      if (ttsProvider === 'on-device') {
        // Apply current settings before speaking
        if (voiceId) TTSService.setVoice(voiceId);
        TTSService.setLanguage(language);
        TTSService.setRate(rate);
        TTSService.setPitch(pitch);
        
        TTSService.speak(textToSpeak);
      } else {
        if (isOffline) {
          Alert.alert('Offline', 'Cloud TTS is not available offline. Please switch to on-device engine in settings or connect to the internet.');
          return;
        }
        setLoadingCloud(true);
        try {
          const uri = await TTSService.speakCloud(textToSpeak, ttsProvider, {
            voiceId,
            languageCode: language,
            rate,
            pitch,
            audioQuality
          });
          audioPlayerRef.current?.play(uri);
          setIsSpeaking(true);
        } catch (err: any) {
          Alert.alert('Cloud TTS Error', err.message);
        } finally {
          setLoadingCloud(false);
        }
      }
    }
  };

  const handleStop = () => {
    if (ttsProvider === 'on-device') {
      TTSService.stop();
    } else {
      audioPlayerRef.current?.stop();
      setIsSpeaking(false);
    }
  };

  const handleExport = async () => {
    if (!content) return;
    
    setExporting(true);
    try {
      const timestamp = Date.now();
      const safeFileName = (fileName || 'recording').replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const destPath = `${RNFS.DocumentDirectoryPath}/${safeFileName}_${timestamp}.mp3`;
      
      // Apply current settings
      if (voiceId) TTSService.setVoice(voiceId);
      TTSService.setLanguage(language);
      TTSService.setRate(rate);
      TTSService.setPitch(pitch);

      const uri = await TTSService.synthesizeToFile(content, destPath);
      
      addAudio({
        id: timestamp.toString(),
        name: `${fileName || 'Text'} Export`,
        uri: uri || destPath,
        createdAt: timestamp,
      });

      Alert.alert('Success', 'Audio exported successfully to library.');
    } catch (err: any) {
      console.error(err);
      Alert.alert('Export Failed', err.message || 'An error occurred during export.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="Pick File" onPress={handlePickFile} />
        {fileName && <Text style={styles.fileName}>{fileName}</Text>}
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <>
          {isSpeaking && (
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
            </View>
          )}
          <ScrollView 
            ref={scrollViewRef}
            style={styles.contentScroll}
          >
            <Text style={styles.contentText}>
              {content ? (
                highlightRange.end > 0 ? (
                  <>
                    <Text>{content.substring(0, highlightRange.start)}</Text>
                    <Text style={styles.highlight}>
                      {content.substring(highlightRange.start, highlightRange.end)}
                    </Text>
                    <Text>{content.substring(highlightRange.end)}</Text>
                  </>
                ) : content
              ) : 'No file selected. Pick a .txt or .pdf file to start reading.'}
            </Text>
          </ScrollView>
          <AudioPlayer ref={audioPlayerRef} />
        </>
      )}

      <View style={styles.footer}>
        <View style={styles.bookmarkControls}>
          <Button title="Add Bookmark" onPress={handleAddBookmark} color="#17a2b8" disabled={!content} />
          <Button title="View Bookmarks" onPress={handleShowBookmarks} color="#17a2b8" disabled={!content} />
        </View>
        <View style={styles.controls}>
          <Button 
            title={loadingCloud ? "..." : (isSpeaking ? "Pause" : "Play")} 
            onPress={isSpeaking ? handleStop : handleSpeak} 
            disabled={!content || exporting || loadingCloud} 
          />
          <Button title="Stop" onPress={handleStop} color="red" disabled={!content || exporting || loadingCloud} />
          <Button 
            title={exporting ? "Exporting..." : "Export Audio"} 
            onPress={handleExport} 
            disabled={!content || exporting || loadingCloud} 
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  fileName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#eee',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007bff',
  },
  loader: {
    flex: 1,
  },
  contentScroll: {
    flex: 1,
    padding: 20,
  },
  contentText: {
    fontSize: 18,
    lineHeight: 26,
    color: '#444',
  },
  highlight: {
    backgroundColor: '#ffeb3b', // Bright yellow
    color: '#000',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  bookmarkControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default ReaderScreen;
