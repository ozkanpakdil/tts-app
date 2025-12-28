import { create } from 'zustand';

interface UserState {
  user: any | null;
  isAuthenticated: boolean;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

interface SettingsState {
  language: string;
  voiceId: string | null;
  rate: number;
  pitch: number;
  theme: 'light' | 'dark' | 'system';
  ttsProvider: 'on-device' | 'amazon' | 'google' | 'azure';
  audioQuality: 'low' | 'medium' | 'high';
  notificationsEnabled: boolean;
  syncQueue: any[];
  setLanguage: (lang: string) => void;
  setVoiceId: (id: string | null) => void;
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setTTSProvider: (provider: 'on-device' | 'amazon' | 'google' | 'azure') => void;
  setAudioQuality: (quality: 'low' | 'medium' | 'high') => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  addToSyncQueue: (action: any) => void;
  clearSyncQueue: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  language: 'en-US',
  voiceId: null,
  rate: 0.5,
  pitch: 1.0,
  theme: 'system',
  ttsProvider: 'on-device',
  audioQuality: 'high',
  notificationsEnabled: true,
  syncQueue: [],
  setLanguage: (language) => set({ language }),
  setVoiceId: (voiceId) => set({ voiceId }),
  setRate: (rate) => set({ rate }),
  setPitch: (pitch) => set({ pitch }),
  setTheme: (theme) => set({ theme }),
  setTTSProvider: (ttsProvider) => set({ ttsProvider }),
  setAudioQuality: (audioQuality) => set({ audioQuality }),
  setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
  addToSyncQueue: (action) => set((state) => ({ syncQueue: [...state.syncQueue, action] })),
  clearSyncQueue: () => set({ syncQueue: [] }),
}));

interface FileInfo {
  name: string;
  uri: string;
  type: string;
  lastOpened: number;
}

interface Bookmark {
  id: string;
  fileUri: string;
  name: string;
  position: number; // character index
  createdAt: number;
}

interface FileState {
  recentFiles: FileInfo[];
  savedDocuments: FileInfo[];
  bookmarks: Bookmark[];
  addRecentFile: (file: FileInfo) => void;
  addDocument: (file: FileInfo) => void;
  removeDocument: (uri: string) => void;
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (id: string) => void;
  clearHistory: () => void;
}

export const useFileStore = create<FileState>((set) => ({
  recentFiles: [],
  savedDocuments: [],
  bookmarks: [],
  addRecentFile: (file) => set((state) => {
    const filtered = state.recentFiles.filter((f) => f.uri !== file.uri);
    return {
      recentFiles: [file, ...filtered].slice(0, 10), // Keep last 10
    };
  }),
  addDocument: (file) => set((state) => {
    const exists = state.savedDocuments.some((f) => f.uri === file.uri);
    if (exists) return state;
    return {
      savedDocuments: [file, ...state.savedDocuments],
    };
  }),
  removeDocument: (uri) => set((state) => ({
    savedDocuments: state.savedDocuments.filter((f) => f.uri !== uri),
    bookmarks: state.bookmarks.filter((b) => b.fileUri !== uri),
  })),
  addBookmark: (bookmark) => set((state) => ({
    bookmarks: [bookmark, ...state.bookmarks],
  })),
  removeBookmark: (id) => set((state) => ({
    bookmarks: state.bookmarks.filter((b) => b.id !== id),
  })),
  clearHistory: () => set({ recentFiles: [] }),
}));

interface AudioInfo {
  id: string;
  name: string;
  uri: string;
  duration?: number;
  createdAt: number;
}

interface AudioState {
  savedAudios: AudioInfo[];
  addAudio: (audio: AudioInfo) => void;
  removeAudio: (id: string) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  savedAudios: [],
  addAudio: (audio) => set((state) => ({
    savedAudios: [audio, ...state.savedAudios],
  })),
  removeAudio: (id) => set((state) => ({
    savedAudios: state.savedAudios.filter((a) => a.id !== id),
  })),
}));
