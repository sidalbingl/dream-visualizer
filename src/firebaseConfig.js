import { Platform } from "react-native";
import { getApps, initializeApp, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";


const firebaseConfig = {
  apiKey: "AIzaSyBmDZ7JqwsDp8yykjMfHQ_z4EbZsQxq2Vg",
  authDomain: "dream-visualizer-e47ee.firebaseapp.com",
  projectId: "dream-visualizer-e47ee",
  storageBucket: "dream-visualizer-e47ee.firebasestorage.app",
  messagingSenderId: "111160570433",
  appId: "1:111160570433:web:d5276eb6d9bdd2614f8cc0",
};


const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Mobilde kalıcı login için 
export const auth =
  Platform.OS === "web"
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });

export default app;
