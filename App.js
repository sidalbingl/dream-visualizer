import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform } from 'react-native';
import Constants from 'expo-constants';

// ✅ UserContext import
import { UserProvider } from './src/context/UserContext';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import DreamInputScreen from './src/screens/DreamInputScreen';
import VisualizationScreen from './src/screens/VisualizationScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import PaywallScreen from './src/screens/PaywallScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import GalleryScreen from './src/screens/GalleryScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ---------------- Bottom Tabs ---------------- 
function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a2e',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          position: 'absolute',
        },
        tabBarBackground: () => (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#1a1a2e',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -3 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 10,
            }}
          />
        ),
        tabBarActiveTintColor: '#8b5cf6',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          if (route.name === 'Gallery') iconName = focused ? 'images' : 'images-outline';
          if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          
          return (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 4 }}>
              <Ionicons name={iconName} size={focused ? 26 : 24} color={color} />
            </View>
          );
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: -2,
        },
      })}
    >
      <Tab.Screen name="Home" component={DreamInputScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Gallery" component={GalleryScreen} options={{ tabBarLabel: 'Gallery' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

// ---------------- Root Stack ---------------- 
export default function App() {
  useEffect(() => {
    // ❌ Adapty devre dışı
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider>
        {/* ✅ Tüm uygulamayı UserProvider ile sardık */}
        <UserProvider>
          <NavigationContainer>
            <StatusBar style="light" backgroundColor="#6366f1" />
            <Stack.Navigator
              initialRouteName="Splash"
              screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: '#1a1a2e' },
              }}
            >
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Paywall" component={PaywallScreen} />
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen name="Visualization" component={VisualizationScreen} />
              <Stack.Screen name="Favorites" component={FavoritesScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} />

            </Stack.Navigator>
          </NavigationContainer>
        </UserProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
