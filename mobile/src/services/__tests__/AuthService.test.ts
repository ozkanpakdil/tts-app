import AuthService from '../AuthService';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { Platform } from 'react-native';

jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
  },
}));

jest.mock('@react-native-firebase/auth', () => {
  const authMock = {
    signInWithCredential: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
  };
  return () => authMock;
});

(auth as any).GoogleAuthProvider = {
  credential: jest.fn(() => 'google-credential'),
};

(auth as any).AppleAuthProvider = {
  credential: jest.fn(() => 'apple-credential'),
};

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

jest.mock('../../store/useStore', () => ({
  useUserStore: {
    getState: () => ({
      setUser: jest.fn(),
      logout: jest.fn(),
    }),
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should sign in with Google', async () => {
    const user = { uid: '123', email: 'test@example.com' };
    (auth().signInWithCredential as jest.Mock).mockResolvedValue({ user });

    const result = await AuthService.signInWithGoogle();

    expect(GoogleSignin.hasPlayServices).toHaveBeenCalled();
    expect(GoogleSignin.signIn).toHaveBeenCalled();
    expect(auth().signInWithCredential).toHaveBeenCalledWith('google-credential');
    expect(result).toEqual(user);
  });

  it('should sign in with Apple', async () => {
    const user = { uid: 'apple-123', email: 'apple@example.com' };
    (Platform as any).OS = 'ios';
    (appleAuth.performRequest as jest.Mock).mockResolvedValue({ 
      user: 'apple-user-id',
      identityToken: 'apple-token',
      nonce: 'nonce'
    });
    (appleAuth.getCredentialStateForUser as jest.Mock).mockResolvedValue('AUTHORIZED');
    (auth().signInWithCredential as jest.Mock).mockResolvedValue({ user });

    const result = await AuthService.signInWithApple();

    expect(appleAuth.performRequest).toHaveBeenCalled();
    expect(auth().signInWithCredential).toHaveBeenCalledWith('apple-credential');
    expect(result).toEqual(user);
  });

  it('should sign out', async () => {
    await AuthService.signOut();

    expect(auth().signOut).toHaveBeenCalled();
    expect(GoogleSignin.signOut).toHaveBeenCalled();
  });

  it('should delete account', async () => {
    const mockUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
      delete: jest.fn().mockResolvedValue(undefined),
    };
    (auth() as any).currentUser = mockUser;
    
    (fetch as any) = jest.fn().mockResolvedValue({ ok: true });

    await AuthService.deleteAccount();

    expect(mockUser.getIdToken).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/users/me'), expect.any(Object));
    expect(mockUser.delete).toHaveBeenCalled();
  });
});
