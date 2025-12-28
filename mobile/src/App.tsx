import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, useColorScheme, ActivityIndicator, View } from 'react-native';
import AuthService from './services/AuthService';
import SyncService from './services/SyncService';
import { useUserStore, useSettingsStore } from './store/useStore';

// Screens
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ReaderScreen from './screens/ReaderScreen';
import SettingsScreen from './screens/SettingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import AudioLibraryScreen from './screens/AudioLibraryScreen';
import DocumentLibraryScreen from './screens/DocumentLibraryScreen';
import PriceCalculatorScreen from './screens/PriceCalculatorScreen';

const Stack = createStackNavigator();
const MainStack = createStackNavigator();

function MainStackScreen() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="Home" component={HomeScreen} />
      <MainStack.Screen name="Reader" component={ReaderScreen} />
      <MainStack.Screen name="Settings" component={SettingsScreen} />
      <MainStack.Screen name="Profile" component={ProfileScreen} />
      <MainStack.Screen name="AudioLibrary" component={AudioLibraryScreen} options={{ title: 'Audio Library' }} />
      <MainStack.Screen name="DocumentLibrary" component={DocumentLibraryScreen} options={{ title: 'Document Library' }} />
      <MainStack.Screen name="PriceCalculator" component={PriceCalculatorScreen} options={{ title: 'Price Calculator' }} />
    </MainStack.Navigator>
  );
}

function App() {
  const systemColorScheme = useColorScheme();
  const { user, setUser } = useUserStore();
  const { theme } = useSettingsStore();
  const [initializing, setInitializing] = useState(true);

  const isDarkMode = theme === 'system' ? systemColorScheme === 'dark' : theme === 'dark';

  useEffect(() => {
    const subscriber = AuthService.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        SyncService.processQueue();
      }
      if (initializing) setInitializing(false);
    });
    return subscriber; // unsubscribe on unmount
  }, [initializing, setUser]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : (
            <Stack.Screen name="Main" component={MainStackScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
