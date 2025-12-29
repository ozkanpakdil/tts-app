jest.mock('react-native-gesture-handler', () => {
  return {
    Swipeable: ({ children }) => children,
    DrawerLayout: ({ children }) => children,
    State: {},
    PanGestureHandler: ({ children }) => children,
    TapGestureHandler: ({ children }) => children,
    FlingGestureHandler: ({ children }) => children,
    ForceTouchGestureHandler: ({ children }) => children,
    LongPressGestureHandler: ({ children }) => children,
    PinchGestureHandler: ({ children }) => children,
    RotationGestureHandler: ({ children }) => children,
    RawButton: ({ children }) => children,
    BaseButton: ({ children }) => children,
    RectButton: ({ children }) => children,
    BorderlessButton: ({ children }) => children,
    NativeViewGestureHandler: ({ children }) => children,
    GestureHandlerRootView: ({ children }) => children,
    Directions: {},
  };
});

jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
  screensEnabled: jest.fn().mockReturnValue(true),
  ScreenContainer: 'View',
  Screen: 'View',
  NativeScreen: 'View',
  NativeScreenContainer: 'View',
  ScreenStack: 'View',
  ScreenStackHeaderConfig: 'View',
  ScreenStackHeaderSubset: 'View',
  ScreenStackHeaderLeftView: 'View',
  ScreenStackHeaderCenterView: 'View',
  ScreenStackHeaderRightView: 'View',
  ScreenStackHeaderSearchBarView: 'View',
  ScreenStackHeaderTitleView: 'View',
  useTransitionProgress: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaConsumer: ({ children }) => children(inset),
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});

jest.mock('@react-native-firebase/auth', () => {
  const authMock = {
    signInWithCredential: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn().mockReturnValue(jest.fn()),
    currentUser: null,
  };
  const auth = () => authMock;
  auth.GoogleAuthProvider = {
    credential: jest.fn(),
  };
  auth.AppleAuthProvider = {
    credential: jest.fn(),
  };
  return auth;
});

jest.mock('@react-native-firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('@react-native-firebase/analytics', () => ({
  getAnalytics: jest.fn(() => ({
    logEvent: jest.fn(),
    setUserId: jest.fn(),
    logScreenView: jest.fn(),
  })),
  logEvent: jest.fn(),
  setUserId: jest.fn(),
  logScreenView: jest.fn(),
}));

jest.mock('@react-native-firebase/crashlytics', () => ({
  getCrashlytics: jest.fn(() => ({
    log: jest.fn(),
    recordError: jest.fn(),
    setUserId: jest.fn(),
  })),
  log: jest.fn(),
  recordError: jest.fn(),
  setUserId: jest.fn(),
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn().mockResolvedValue(true),
    signIn: jest.fn().mockResolvedValue({ idToken: 'google-id-token' }),
    signOut: jest.fn(),
  },
}));

jest.mock('@invertase/react-native-apple-authentication', () => ({
  appleAuth: {
    performRequest: jest.fn(),
    getCredentialStateForUser: jest.fn(),
    Operation: { LOGIN: 'LOGIN' },
    Scope: { EMAIL: 'EMAIL', FULL_NAME: 'FULL_NAME' },
    State: { AUTHORIZED: 'AUTHORIZED' },
  },
}));

jest.mock('react-native-tts', () => ({
  getInitStatus: jest.fn().mockResolvedValue('success'),
  speak: jest.fn(),
  stop: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  setDucking: jest.fn(),
  setDefaultLanguage: jest.fn(),
  setDefaultRate: jest.fn(),
  setDefaultPitch: jest.fn(),
  voices: jest.fn().mockResolvedValue([]),
}));

jest.mock('react-native-document-picker', () => ({
  pick: jest.fn(),
  types: {
    allFiles: 'allFiles',
    audio: 'audio',
    pdf: 'pdf',
  },
}));

jest.mock('react-native-blob-util', () => ({
  fs: {
    dirs: {
      DocumentDir: '/mock/document/dir',
      CacheDir: '/mock/cache/dir',
    },
    writeFile: jest.fn(),
    readFile: jest.fn(),
    exists: jest.fn(),
    mkdir: jest.fn(),
    unlink: jest.fn(),
  },
}));

jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/mock/document/path',
  CachesDirectoryPath: '/mock/cache/path',
  writeFile: jest.fn(),
  readFile: jest.fn(),
  readDir: jest.fn(),
  mkdir: jest.fn(),
  unlink: jest.fn(),
  exists: jest.fn(),
}));

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

jest.mock('react-native-video', () => 'Video');
jest.mock('react-native-share', () => ({
  open: jest.fn(),
  shareSingle: jest.fn(),
  isPackageInstalled: jest.fn(),
}));

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
  fetch: jest.fn().mockResolvedValue({
    isConnected: true,
    isInternetReachable: true,
  }),
  useNetInfo: jest.fn().mockReturnValue({
    isConnected: true,
    isInternetReachable: true,
  }),
}));
