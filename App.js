import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import DreamInputScreen from './src/screens/DreamInputScreen';
import VisualizationScreen from './src/screens/VisualizationScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import PaywallScreen from './src/screens/PaywallScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor="#6366f1" />
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: '#1a1a2e' }
            }}
          >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="DreamInput" component={DreamInputScreen} />
            <Stack.Screen name="Visualization" component={VisualizationScreen} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
            <Stack.Screen name="Paywall" component={PaywallScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
