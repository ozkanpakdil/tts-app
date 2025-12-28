import React, { useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import { useAudioStore } from '../store/useStore';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import AudioPlayer, { AudioPlayerRef } from '../components/AudioPlayer';

const AudioLibraryScreen = () => {
  const { savedAudios, removeAudio } = useAudioStore();
  const audioPlayerRef = useRef<AudioPlayerRef>(null);

  const handlePlay = (uri: string) => {
    audioPlayerRef.current?.play(uri);
  };

  const handleShare = async (uri: string, name: string) => {
    try {
      await Share.open({
        url: `file://${uri}`,
        filename: name,
        type: 'audio/mpeg',
      });
    } catch (error: any) {
      if (error.message !== 'User did not share') {
        Alert.alert('Error', 'Failed to share audio: ' + error.message);
      }
    }
  };

  const handleDelete = (id: string, uri: string) => {
    Alert.alert(
      'Delete Audio',
      'Are you sure you want to delete this recording?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              if (await RNFS.exists(uri)) {
                await RNFS.unlink(uri);
              }
              removeAudio(id);
            } catch (err: any) {
              Alert.alert('Error', 'Failed to delete file: ' + err.message);
            }
          }
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.audioItem}>
      <View style={styles.audioInfo}>
        <Text style={styles.audioName}>{item.name}</Text>
        <Text style={styles.audioDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.playButton]} 
          onPress={() => handlePlay(item.uri)}
        >
          <Text style={styles.actionText}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleShare(item.uri, item.name)}
        >
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => handleDelete(item.id, item.uri)}
        >
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {savedAudios.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No saved audio files yet.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={savedAudios}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
          <AudioPlayer ref={audioPlayerRef} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 15,
  },
  audioItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  audioInfo: {
    flex: 1,
  },
  audioName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  audioDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  playButton: {
    backgroundColor: '#28a745',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default AudioLibraryScreen;
