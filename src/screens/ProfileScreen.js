import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { User, Settings, HelpCircle, Share2, Star, Heart, Crown, Moon, ChevronRight, LogOut } from "lucide-react-native";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { logout } from "../services/authService";

// Profil eylemleri
const profileActions = [
  { icon: User, label: "Edit Profile", subtitle: "Update your personal information", onPress: () => console.log("Edit Profile") },
  { icon: Crown, label: "Premium Features", subtitle: "Manage your subscription", onPress: () => console.log("Premium Features"), premium: true },
  { icon: Heart, label: "Favorite Dreams", subtitle: "View your saved dreams", onPress: () => console.log("Favorite Dreams") },
  { icon: Settings, label: "Settings", subtitle: "App preferences and notifications", onPress: () => console.log("Settings") },
  { icon: Share2, label: "Share App", subtitle: "Invite friends to Dream Visualizer", onPress: () => console.log("Share App") },
  { icon: Star, label: "Rate App", subtitle: "Leave a review in the App Store", onPress: () => console.log("Rate App") },
  { icon: HelpCircle, label: "Help & Support", subtitle: "Get help and contact support", onPress: () => console.log("Help & Support") },
];

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold });
  if (!fontsLoaded) return null;

  const handleSignOut = async () => {
    const confirmed = Platform.OS === 'web' 
      ? window.confirm("Are you sure you want to sign out?")
      : await new Promise((resolve) => {
          Alert.alert("Sign Out", "Are you sure you want to sign out?", [
            { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
            { text: "Sign Out", style: "destructive", onPress: () => resolve(true) },
          ]);
        });

    if (!confirmed) return;

    try {
      await logout();
      
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      if (Platform.OS === 'web') {
        alert("Sign out failed: " + (error.message || "Unknown error"));
      } else {
        Alert.alert("Sign Out Error", error.message || "An error occurred");
      }
    }
  };

  const renderActionItem = (action) => {
    const IconComponent = action.icon;
    return (
      <TouchableOpacity
        key={action.label}
        onPress={action.onPress}
        style={[styles.actionItem, { borderColor: action.premium ? "#667eea" : "rgba(255, 255, 255, 0.2)" }]}
      >
        <View style={[styles.actionIconContainer, { backgroundColor: action.premium ? "#667eea" : "rgba(255, 255, 255, 0.2)" }]}>
          <IconComponent size={24} color="#FFFFFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.actionLabel}>{action.label}</Text>
          <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
        </View>
        <ChevronRight size={20} color="rgba(255, 255, 255, 0.6)" />
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={isDark ? ["#1a1a2e", "#16213e", "#0f1419"] : ["#667eea", "#764ba2", "#f093fb"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar style="light" />
      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 16 }}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 20 }} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Moon size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.profileName}>Dream Explorer</Text>
          <Text style={styles.profileEmail}>dreamer@example.com</Text>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Dreams</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>Free</Text>
              <Text style={styles.statLabel}>Plan</Text>
            </View>
          </View>
        </View>

        <View style={{ marginBottom: 30 }}>
          {profileActions.map(renderActionItem)}
        </View>

        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <LogOut size={20} color="#f87171" style={{ marginRight: 8 }} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.appVersion}>Dream Visualizer v1.0.0</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerTitle: { fontSize: 28, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
  profileCard: { backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 20, padding: 24, marginBottom: 30, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", alignItems: "center" },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center", marginBottom: 16, borderWidth: 3, borderColor: "rgba(255,255,255,0.3)" },
  profileName: { fontSize: 24, fontFamily: "Inter_600SemiBold", color: "#FFFFFF", marginBottom: 4 },
  profileEmail: { fontSize: 16, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.8)", marginBottom: 20 },
  statsContainer: { flexDirection: "row", justifyContent: "space-around", width: "100%" },
  stat: { alignItems: "center" },
  statNumber: { fontSize: 20, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
  statLabel: { fontSize: 14, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)" },
  divider: { width: 1, height: 40, backgroundColor: "rgba(255,255,255,0.3)" },
  actionItem: { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 16, padding: 20, marginBottom: 12, flexDirection: "row", alignItems: "center", borderWidth: 1 },
  actionIconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: "center", alignItems: "center", marginRight: 16 },
  actionLabel: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#FFFFFF", marginBottom: 2 },
  actionSubtitle: { fontSize: 14, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)", lineHeight: 18 },
  signOutButton: { backgroundColor: "rgba(248,113,113,0.2)", borderRadius: 16, padding: 20, flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(248,113,113,0.3)" },
  signOutText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#f87171" },
  appVersion: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.5)", textAlign: "center", marginTop: 20 },
});