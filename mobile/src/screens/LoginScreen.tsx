import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert, Platform } from 'react-native';
import AuthService from '../services/AuthService';
import { AppleButton } from '@invertase/react-native-apple-authentication';

const LoginScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await AuthService.signInWithGoogle();
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred during Google Sign-In');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    try {
      await AuthService.signInWithApple();
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred during Apple Sign-In');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipLogin = () => {
    navigation.replace('Main');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to TTS App</Text>
      <Text style={styles.subtitle}>Sign in to sync your preferences and use cloud voices</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.buttonContainer}>
          <Button
            title="Sign In with Google"
            onPress={handleGoogleLogin}
          />
          
          {Platform.OS === 'ios' && (
            <>
              <View style={{ marginVertical: 10 }} />
              <AppleButton
                buttonStyle={AppleButton.Style.BLACK}
                buttonType={AppleButton.Type.SIGN_IN}
                style={styles.appleButton}
                onPress={handleAppleLogin}
              />
            </>
          )}

          <View style={{ marginVertical: 10 }} />
          <Button
            title="Skip for now (Demo)"
            onPress={handleSkipLogin}
            color="#888"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  appleButton: {
    width: '100%',
    height: 45,
  },
});

export default LoginScreen;
