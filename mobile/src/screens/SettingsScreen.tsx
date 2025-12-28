import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Switch, Alert, Button, Linking } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import TTSService from '../services/TTSService';
import SyncService from '../services/SyncService';
import { useSettingsStore } from '../store/useStore';

const SettingsScreen = () => {
  const { 
    language, voiceId, rate, pitch, theme, ttsProvider, audioQuality, notificationsEnabled,
    setLanguage, setVoiceId, setRate, setPitch, setTheme, setTTSProvider, setAudioQuality, setNotificationsEnabled
  } = useSettingsStore();

  const [voices, setVoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoices = async () => {
      setLoading(true);
      try {
        if (ttsProvider === 'on-device') {
            const availableVoices = await TTSService.getVoices();
            setVoices(availableVoices);
        } else {
            const cloudVoices = await TTSService.getCloudVoices(ttsProvider);
            setVoices(cloudVoices);
        }
      } catch (err) {
        console.error('Error fetching voices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVoices();
  }, [ttsProvider]);

  const handleVoiceChange = (vId: string | null) => {
    setVoiceId(vId);
    if (vId === null) {
      SyncService.queueSync();
      return;
    }
    const voice = voices.find(v => v.id === vId);
    if (voice) {
      const lang = voice.language || voice.languageCode;
      setLanguage(lang);
      if (ttsProvider === 'on-device') {
          TTSService.setLanguage(lang);
          TTSService.setVoice(vId);
      }
      SyncService.queueSync();
    }
  };

  const adjustRate = (delta: number) => {
    const newRate = Math.max(0.1, Math.min(2.0, rate + delta));
    setRate(newRate);
    TTSService.setRate(newRate);
    SyncService.queueSync();
  };

  const adjustPitch = (delta: number) => {
    const newPitch = Math.max(0.5, Math.min(2.0, pitch + delta));
    setPitch(newPitch);
    TTSService.setPitch(newPitch);
    SyncService.queueSync();
  };

  const handleThemeChange = (itemValue: 'light' | 'dark' | 'system') => {
    setTheme(itemValue);
    SyncService.queueSync();
  };

  const handleFeedback = () => {
    const email = 'support@ttsapp.com';
    const subject = 'App Feedback - v1.0.0';
    const body = 'Please describe your feedback or report an issue here...';
    Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleDownloadVoices = () => {
    if (ttsProvider === 'on-device') {
      TTSService.stop(); // Stop any current speech
      TTSService.requestInstallEngine();
    } else {
      Alert.alert('Not Supported', 'Offline download is only available for the on-device engine.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>TTS Engine</Text>
      
      <View style={styles.settingItem}>
        <Text style={styles.label}>Select Provider</Text>
        <Picker
          selectedValue={ttsProvider}
          onValueChange={(itemValue) => setTTSProvider(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="On-Device (Free)" value="on-device" />
          <Picker.Item label="Amazon Polly (Paid)" value="amazon" />
          <Picker.Item label="Google Cloud TTS (Paid)" value="google" />
          <Picker.Item label="Azure Speech (Paid)" value="azure" />
        </Picker>
        {ttsProvider === 'on-device' && (
          <View style={{ marginTop: 10 }}>
            <Button title="Download Offline Voice Data" onPress={handleDownloadVoices} color="#6c757d" />
          </View>
        )}
      </View>

      <Text style={styles.sectionTitle}>Voice Settings</Text>
      
      <View style={styles.settingItem}>
        <Text style={styles.label}>Select Voice / Language</Text>
        <Picker
          selectedValue={voiceId}
          onValueChange={(itemValue) => handleVoiceChange(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Default" value={null} />
          {voices.map((voice) => (
            <Picker.Item 
              key={voice.id} 
              label={`${voice.name} (${voice.language || voice.languageCode})`} 
              value={voice.id} 
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.sectionTitle}>Speech Properties</Text>
      
      <View style={styles.settingItem}>
        <Text style={styles.label}>Rate: {rate.toFixed(1)}</Text>
        <View style={styles.row}>
            <TouchableOpacity onPress={() => adjustRate(-0.1)} style={styles.smallButton}>
                <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => adjustRate(0.1)} style={styles.smallButton}>
                <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
        </View>
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.label}>Pitch: {pitch.toFixed(1)}</Text>
        <View style={styles.row}>
            <TouchableOpacity onPress={() => adjustPitch(-0.1)} style={styles.smallButton}>
                <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => adjustPitch(0.1)} style={styles.smallButton}>
                <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>App Settings</Text>
      
      <View style={styles.settingItem}>
        <Text style={styles.label}>Theme</Text>
        <Picker
          selectedValue={theme}
          onValueChange={(itemValue) => handleThemeChange(itemValue as any)}
          style={styles.picker}
        >
          <Picker.Item label="System Default" value="system" />
          <Picker.Item label="Light" value="light" />
          <Picker.Item label="Dark" value="dark" />
        </Picker>
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.label}>Audio Quality (Cloud Only)</Text>
        <Picker
          selectedValue={audioQuality}
          onValueChange={(itemValue) => setAudioQuality(itemValue as any)}
          style={styles.picker}
        >
          <Picker.Item label="High (48kHz)" value="high" />
          <Picker.Item label="Medium (24kHz)" value="medium" />
          <Picker.Item label="Low (8kHz)" value="low" />
        </Picker>
      </View>
      
      <View style={styles.settingItem}>
        <View style={styles.rowBetween}>
            <Text style={styles.label}>Enable Notifications</Text>
            <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={notificationsEnabled ? "#007bff" : "#f4f3f4"}
            />
        </View>
      </View>

      <Text style={styles.sectionTitle}>About & Legal</Text>
      
      <View style={styles.settingItem}>
        <Button 
          title="Send Feedback" 
          onPress={handleFeedback} 
          color="#28a745"
        />
        <View style={{ height: 10 }} />
        <Button 
          title="View Privacy Policy" 
          onPress={() => Alert.alert('Privacy Policy', 'Our Privacy Policy can be found at https://ttsapp.com/privacy\n\nWe are GDPR compliant. You have the right to access and delete your data at any time via the Profile screen.')} 
          color="#6c757d"
        />
        <View style={{ height: 10 }} />
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  settingItem: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  picker: {
    backgroundColor: '#f9f9f9',
  },
  row: {
    flexDirection: 'row',
    gap: 20,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallButton: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
    width: 40,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  versionText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 12,
  }
});

export default SettingsScreen;
