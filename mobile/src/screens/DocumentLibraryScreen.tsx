import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import { useFileStore } from '../store/useStore';
import FileService from '../services/FileService';
import { useTheme } from '@react-navigation/native';

const DocumentLibraryScreen = ({ navigation }: any) => {
  const { savedDocuments, removeDocument } = useFileStore();
  const { colors } = useTheme();

  const handleOpen = (file: any) => {
    navigation.navigate('Reader', { file });
  };

  const handleDelete = (uri: string) => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document from your library?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await FileService.deleteFile(uri);
              removeDocument(uri);
            } catch (err: any) {
              Alert.alert('Error', 'Failed to delete file: ' + err.message);
            }
          }
        },
      ]
    );
  };

  const handlePickAndSave = async () => {
    const file = await FileService.pickDocument();
    if (file) {
      try {
        const savedUri = await FileService.saveToInternalStorage(file.uri, file.name || 'document');
        useFileStore.getState().addDocument({
          name: file.name || 'Unknown',
          uri: savedUri,
          type: file.type || 'text/plain',
          lastOpened: Date.now(),
        });
      } catch (err: any) {
        Alert.alert('Error', 'Failed to save document: ' + err.message);
      }
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.docItem, { backgroundColor: colors.card }]}>
      <View style={styles.docInfo}>
        <Text style={[styles.docName, { color: colors.text }]}>{item.name}</Text>
        <Text style={styles.docDetails}>
          {item.type.split('/')[1]?.toUpperCase()} • {new Date(item.lastOpened).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.openButton]} 
          onPress={() => handleOpen(item)}
        >
          <Text style={styles.actionText}>Open</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => handleDelete(item.uri)}
        >
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Button title="Import Document" onPress={handlePickAndSave} />
      </View>
      {savedDocuments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.text }]}>No documents in your library.</Text>
        </View>
      ) : (
        <FlatList
          data={savedDocuments}
          renderItem={renderItem}
          keyExtractor={(item) => item.uri}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listContent: {
    padding: 15,
  },
  docItem: {
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
  docInfo: {
    flex: 1,
  },
  docName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  docDetails: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  openButton: {
    backgroundColor: '#007bff',
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

export default DocumentLibraryScreen;