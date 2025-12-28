import auth from '@react-native-firebase/auth';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
const GoogleSignin: any = {
  configure: () => {},
  hasPlayServices: () => Promise.resolve(true),
  signIn: () => Promise.reject(new Error('Google Sign-In disabled in demo')),
  signOut: () => Promise.resolve(),
};
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { useUserStore } from '../store/useStore';
import { Platform } from 'react-native';

const API_BASE_URL = 'http://localhost:8080/api'; // Adjust for your environment

class AuthService {
  constructor() {
    this.setupGoogleSignin();
  }

  private setupGoogleSignin() {
    // Completely skip configuration if we don't have a GoogleService-Info.plist or webClientId
    // For demo purposes in simulator, we just log and skip to avoid crashing the whole app
    console.log('Skipping GoogleSignin configuration to avoid crash without valid config');
  }

  public async signInWithGoogle() {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Get the users ID token
      const signInRes = await GoogleSignin.signIn();
      const idToken = (signInRes as any).idToken || (signInRes as any).data?.idToken;

      if (!idToken) throw new Error('No ID Token found');

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      
      useUserStore.getState().setUser(userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  }

  public async signInWithApple() {
    if (Platform.OS !== 'ios') {
      throw new Error('Apple Sign-In is only available on iOS');
    }

    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

      if (credentialState === appleAuth.State.AUTHORIZED) {
        const { identityToken, nonce } = appleAuthRequestResponse;
        if (!identityToken) throw new Error('Apple identity token is missing');

        const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
        const userCredential = await auth().signInWithCredential(appleCredential);
        
        useUserStore.getState().setUser(userCredential.user);
        return userCredential.user;
      } else {
        throw new Error('Apple authentication failed');
      }
    } catch (error: any) {
      if (error.code === appleAuth.Error.CANCELED) {
        console.log('User cancelled Apple Sign-In');
      } else {
        console.error('Apple Sign-In Error:', error);
        throw error;
      }
    }
  }

  public async signOut() {
    try {
      await auth().signOut();
      await GoogleSignin.signOut();
      useUserStore.getState().logout();
    } catch (error) {
      console.error('Sign-Out Error:', error);
      throw error;
    }
  }

  public async deleteAccount() {
    try {
      const user = auth().currentUser;
      if (user) {
        const token = await user.getIdToken();
        // Call backend to delete data
        await fetch(`${API_BASE_URL}/users/me`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        // Delete Firebase user
        await user.delete();
        
        await this.signOut();
      }
    } catch (error) {
      console.error('Delete Account Error:', error);
      throw error;
    }
  }

  public onAuthStateChanged(callback: (user: any) => void) {
    try {
      const authInstance = auth();
      if (!authInstance) throw new Error('Firebase Auth not available');
      return authInstance.onAuthStateChanged((user) => {
        useUserStore.getState().setUser(user);
        callback(user);
      });
    } catch (error) {
      console.log('Firebase Auth onAuthStateChanged error caught:', error);
      // Fallback: immediately say we are not authenticated to allow app to proceed to login screen
      setTimeout(() => callback(null), 0);
      return () => {}; // No-op unsubscribe
    }
  }

  public skipLogin() {
    const dummyUser = {
      uid: 'demo-user',
      displayName: 'Demo User',
      email: 'demo@example.com',
      isAnonymous: true,
    };
    useUserStore.getState().setUser(dummyUser);
  }
}

export default new AuthService();
