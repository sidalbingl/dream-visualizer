import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, Modal, Pressable, Platform, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bell, Globe, Monitor, RefreshCw, FileText, ChevronRight } from "lucide-react-native";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [theme, setTheme] = useState("System");
  const [language, setLanguage] = useState("English");

  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);

  const openLink = (url) => {
    Platform.OS === "web" ? window.open(url, "_blank") : Linking.openURL(url);
  };

  return (
    <LinearGradient colors={["#1a1a2e", "#16213e", "#0f1419"]} style={{ flex: 1 }}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={{ paddingTop: insets.top + 24, paddingHorizontal: 24, paddingBottom: 24 }}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Personalize your Dream Visualizer</Text>
      </View>

      {/* Notifications */}
      <View style={styles.card}>
        <Bell size={22} color="#fff" style={{ marginRight: 12 }} />
        <Text style={styles.cardLabel}>Push Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: "rgba(255,255,255,0.3)", true: "#8b5cf6" }}
          thumbColor="#fff"
        />
      </View>

      {/* Theme */}
      <TouchableOpacity style={styles.card} onPress={() => setThemeModalVisible(true)}>
        <Monitor size={22} color="#fff" style={{ marginRight: 12 }} />
        <Text style={styles.cardLabel}>Theme</Text>
        <Text style={styles.valueText}>{theme}</Text>
        <ChevronRight size={20} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>

      {/* Language */}
      <TouchableOpacity style={styles.card} onPress={() => setLangModalVisible(true)}>
        <Globe size={22} color="#fff" style={{ marginRight: 12 }} />
        <Text style={styles.cardLabel}>Language</Text>
        <Text style={styles.valueText}>{language}</Text>
        <ChevronRight size={20} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>

      {/* Restore Purchases */}
      <TouchableOpacity style={styles.card} onPress={() => alert("Restore purchases triggered!")}>
        <RefreshCw size={22} color="#fff" style={{ marginRight: 12 }} />
        <Text style={styles.cardLabel}>Restore Purchases</Text>
      </TouchableOpacity>

      {/* Privacy */}
      <TouchableOpacity style={styles.card} onPress={() => openLink("https://example.com/privacy")}>
        <FileText size={22} color="#fff" style={{ marginRight: 12 }} />
        <Text style={styles.cardLabel}>Privacy Policy</Text>
      </TouchableOpacity>

      {/* Terms */}
      <TouchableOpacity style={styles.card} onPress={() => openLink("https://example.com/terms")}>
        <FileText size={22} color="#fff" style={{ marginRight: 12 }} />
        <Text style={styles.cardLabel}>Terms of Service</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.divider} />
        <Text style={styles.appVersion}>Dream Visualizer v1.0.0</Text>
      </View>

      {/* Theme Modal */}
      <Modal visible={themeModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {["System", "Light", "Dark"].map((t) => (
              <Pressable
                key={t}
                style={styles.modalOption}
                onPress={() => {
                  setTheme(t);
                  setThemeModalVisible(false);
                }}
              >
                <Text style={[styles.modalText, theme === t && styles.modalTextActive]}>{t}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal visible={langModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {["English", "Türkçe"].map((l) => (
              <Pressable
                key={l}
                style={styles.modalOption}
                onPress={() => {
                  setLanguage(l);
                  setLangModalVisible(false);
                }}
              >
                <Text style={[styles.modalText, language === l && styles.modalTextActive]}>{l}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.7)",
    marginTop: 6,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  cardLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    flex: 1,
  },
  valueText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    marginRight: 6,
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
  },
  divider: {
    width: "80%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 10,
  },
  appVersion: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#1f1f2e",
    paddingVertical: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalOption: {
    paddingVertical: 16,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  modalTextActive: {
    color: "#8b5cf6",
    fontWeight: "bold",
  },
});
