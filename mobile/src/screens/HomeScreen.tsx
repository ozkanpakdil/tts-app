import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Button, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import TTSService from '../services/TTSService';
import { useFileStore, useSettingsStore, useAudioStore } from '../store/useStore';
import RNFS from 'react-native-fs';
import AudioPlayer, { AudioPlayerRef } from '../components/AudioPlayer';
import { useOfflineStatus } from '../hooks/useOfflineStatus';

const HomeScreen = ({ navigation }: any) => {
  const [text, setText] = useState('Welcome to the TTS App. You can type anything here and I will read it for you.');
  const recentFiles = useFileStore((state) => state.recentFiles);
  const addAudio = useAudioStore((state) => state.addAudio);
  const { language, voiceId, rate, pitch, ttsProvider, audioQuality } = useSettingsStore();
  const [exporting, setExporting] = useState(false);
  const [loadingCloud, setLoadingCloud] = useState(false);
  const audioPlayerRef = useRef<AudioPlayerRef>(null);
  const isOffline = useOfflineStatus();

  const handleSpeak = async () => {
    if (!text.trim()) return;

    if (ttsProvider === 'on-device') {
      if (voiceId) TTSService.setVoice(voiceId);
      TTSService.setLanguage(language);
      TTSService.setRate(rate);
      TTSService.setPitch(pitch);
      TTSService.speak(text);
    } else {
      if (isOffline) {
        Alert.alert('Offline', 'Cloud TTS is not available offline. Please switch to on-device engine in settings or connect to the internet.');
        return;
      }
      setLoadingCloud(true);
      try {
        const uri = await TTSService.speakCloud(text, ttsProvider, {
          voiceId,
          languageCode: language,
          rate,
          pitch,
          audioQuality
        });
        audioPlayerRef.current?.play(uri);
      } catch (err: any) {
        Alert.alert('Cloud TTS Error', err.message);
      } finally {
        setLoadingCloud(false);
      }
    }
  };

  const handleStop = () => {
    if (ttsProvider === 'on-device') {
      TTSService.stop();
    } else {
      audioPlayerRef.current?.stop();
    }
  };

  const handleExport = async () => {
    if (!text.trim()) return;
    
    setExporting(true);
    try {
      const timestamp = Date.now();
      const destPath = `${RNFS.DocumentDirectoryPath}/quick_export_${timestamp}.mp3`;
      
      if (voiceId) TTSService.setVoice(voiceId);
      TTSService.setLanguage(language);
      TTSService.setRate(rate);
      TTSService.setPitch(pitch);

      const uri = await TTSService.synthesizeToFile(text, destPath);
      
      addAudio({
        id: timestamp.toString(),
        name: `Quick Export ${new Date(timestamp).toLocaleTimeString()}`,
        uri: uri || destPath,
        createdAt: timestamp,
      });

      Alert.alert('Success', 'Audio exported to library.');
    } catch (err: any) {
      Alert.alert('Export Failed', err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>TTS App</Text>
      
      <TextInput
        style={styles.input}
        multiline
        placeholder="Enter text to speak..."
        value={text}
        onChangeText={setText}
      />

      <View style={styles.buttonContainer}>
        <Button 
          title={loadingCloud ? "..." : "Speak"} 
          onPress={handleSpeak} 
          disabled={exporting || loadingCloud} 
        />
        <Button title="Stop" onPress={handleStop} color="red" disabled={exporting || loadingCloud} />
        <Button 
          title={exporting ? "..." : "Export"} 
          onPress={handleExport} 
          disabled={exporting || loadingCloud || !text.trim()} 
        />
      </View>

      <AudioPlayer ref={audioPlayerRef} />

      {recentFiles.length > 0 && (
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Files</Text>
          {recentFiles.map((file, index) => (
            <TouchableOpacity 
              key={`${file.uri}-${index}`}
              style={styles.fileItem}
              onPress={() => navigation.navigate('Reader', { file })}
            >
              <Text style={styles.fileName}>{file.name}</Text>
              <Text style={styles.fileType}>{file.type.split('/')[1]?.toUpperCase() || 'FILE'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.navButtons}>
        <Button
          title="Document Library"
          onPress={() => navigation.navigate('DocumentLibrary')}
          color="#007bff"
        />
        <Button
          title="Audio Library"
          onPress={() => navigation.navigate('AudioLibrary')}
          color="#28a745"
        />
        <Button
          title="Settings"
          onPress={() => navigation.navigate('Settings')}
        />
        <Button
          title="Profile"
          onPress={() => navigation.navigate('Profile')}
        />
        <Button
          title="Price Calculator"
          onPress={() => navigation.navigate('PriceCalculator')}
          color="#17a2b8"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    minHeight: 150,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    textAlignVertical: 'top',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  recentSection: {
    width: '100%',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  fileName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  fileType: {
    fontSize: 12,
    color: '#888',
    marginLeft: 10,
  },
  navButtons: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
});

export default HomeScreen;
