import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Mic, Sparkles, MicOff } from "lucide-react-native";
// Fonts are loaded globally in App.js (Montserrat)
import { Audio } from "expo-av";
import axios from "axios";

// ✅ Premium/Standart kontrolü
import { useUser } from "../context/UserContext";

const API_BASE = "https://pectous-equicontinuous-alec.ngrok-free.dev";

export default function DreamInputScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [dreamText, setDreamText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const recordingRef = useRef(null);

  const { isPremium, setIsPremium } = useUser(); // 🔑 premium context

  // Animations
  const glowAnimation = useRef(new Animated.Value(0)).current;
  const micPulse = useRef(new Animated.Value(1)).current;

  // No local font gate needed; fonts are global

  useEffect(() => {
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        Animated.timing(glowAnimation, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
      ])
    );
    glowLoop.start();
    return () => glowLoop.stop();
  }, []);

  useEffect(() => {
    if (isRecording) {
      const micLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(micPulse, { toValue: 1.2, duration: 500, useNativeDriver: true }),
          Animated.timing(micPulse, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      );
      micLoop.start();
      return () => micLoop.stop();
    }
  }, [isRecording]);

  // Fonts already loaded globally

  // 🎙 Mikrofon basınca kayıt başlat / durdur
  const handleMicPress = async () => {
    if (isRecording) {
      // ⏹️ Kayıt durdur
      setIsRecording(false);
      setIsTranscribing(true);
      try {
        await recordingRef.current.stopAndUnloadAsync();
        const uri = recordingRef.current.getURI();

        const formData = new FormData();
        formData.append("audio", { uri, type: "audio/m4a", name: "recording.m4a" });

        const uploadRes = await axios.post(`${API_BASE}/api/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data", "ngrok-skip-browser-warning": "true" },
          timeout: 30000,
        });

        const audioUrl = uploadRes.data.url;
        if (!audioUrl) throw new Error("Backend'den URL alınamadı");

        const transcriptRes = await axios.post(`${API_BASE}/api/stt`, { audio_url: audioUrl }, {
          headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
          timeout: 60000,
        });

        const text = transcriptRes.data?.text || "";
        if (!text) {
          Alert.alert("Uyarı", "Ses metne çevrilemedi. Lütfen tekrar deneyin.");
          return;
        }

        setDreamText((prev) => (prev.trim() ? `${prev.trim()} ${text.trim()}` : text.trim()));
        Alert.alert("Başarılı!", "Ses metne çevrildi.");
      } catch (err) {
        console.error("❌ STT Hatası:", err.message);
        Alert.alert("Hata", "Ses metne çevrilemedi.");
      } finally {
        setIsTranscribing(false);
      }
    } else {
      // 🎙️ Kayıt başlat
      setIsRecording(true);
      try {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Hata", "Mikrofon izni gerekli!");
          setIsRecording(false);
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: false,
        });

        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        await recording.startAsync();
        recordingRef.current = recording;
      } catch (err) {
        console.error("❌ Kayıt hatası:", err.message);
        Alert.alert("Hata", "Kayıt başlatılamadı.");
        setIsRecording(false);
      }
    }
  };

  // 🌌 Visualize
  const handleVisualize = async () => {
    if (!dreamText.trim()) {
      Alert.alert("Lütfen rüyanızı anlatın", "Metin girin veya sesli kayıt yapın.");
      return;
    }
    setIsGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      navigation.navigate("Visualization", {
        dreamText: dreamText.trim(),
        style: "realistic",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const glowColor = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(102,126,234,0.3)", "rgba(102,126,234,0.8)"],
  });

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <LinearGradient colors={["#1a1a2e", "#16213e", "#0f3460"]} style={{ flex: 1 }}>
        <StatusBar style="light" />

        {/* Header */}
        <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 40, paddingBottom: 40 }}>
          <Text style={{ fontSize: 28, fontFamily: "Montserrat_600SemiBold", color: "#FFFFFF", textAlign: "center" }}>
            Dream Visualizer
          </Text>
          <Text style={{ fontSize: 16, fontFamily: "Montserrat_400Regular", color: "rgba(255,255,255,0.8)", textAlign: "center", marginTop: 4 }}>
            Bring your dreams to life
          </Text>
        </View>

        {/* Content */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom: insets.bottom + 20 }} showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, justifyContent: "center", paddingVertical: 40 }}>
            
            {/* Dream Input Card */}
            <View style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 20, padding: 24, marginBottom: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" }}>
              <Text style={{ fontSize: 18, fontFamily: "Montserrat_600SemiBold", color: "#FFFFFF", marginBottom: 16, textAlign: "center" }}>
                Describe Your Dream
              </Text>

              {/* Text Input + Mic */}
              <View style={{ position: "relative" }}>
                <TextInput
                  style={{ backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 16, padding: 20, paddingRight: 60, fontSize: 16, fontFamily: "Montserrat_400Regular", color: "#333", minHeight: 120, textAlignVertical: "top" }}
                  placeholder="Describe your dream..."
                  placeholderTextColor="#999"
                  multiline
                  value={dreamText}
                  onChangeText={setDreamText}
                  editable={!isTranscribing}
                />
                <Animated.View style={{ position: "absolute", bottom: 16, right: 16, transform: [{ scale: micPulse }] }}>
                  <TouchableOpacity
                    onPress={handleMicPress}
                    disabled={isTranscribing}
                    style={{
                      width: 40, height: 40, borderRadius: 20,
                      backgroundColor: isRecording ? "#f87171" : isTranscribing ? "#fbbf24" : "#667eea",
                      justifyContent: "center", alignItems: "center", opacity: isTranscribing ? 0.7 : 1,
                    }}
                  >
                    {isRecording ? <MicOff size={20} color="#fff" /> : <Mic size={20} color="#fff" />}
                  </TouchableOpacity>
                </Animated.View>
              </View>

              {isRecording && <Text style={{ fontSize: 14, fontFamily: "Montserrat_500Medium", color: "#f87171", textAlign: "center", marginTop: 12 }}>Recording... Tap mic to stop</Text>}
              {isTranscribing && <Text style={{ fontSize: 14, fontFamily: "Montserrat_500Medium", color: "#fbbf24", textAlign: "center", marginTop: 12 }}>Converting speech to text...</Text>}
            </View>

            {/* 🔑 Premium Toggle */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20, backgroundColor: "rgba(255,255,255,0.1)", padding: 16, borderRadius: 12 }}>
              <Text style={{ color: "white", fontSize: 16 }}>
                {isPremium ? "🌟 Premium Aktif" : "🔓 Standart Aktif"}
              </Text>
              <Switch value={isPremium} onValueChange={setIsPremium} />
            </View>

            {/* Visualize Button */}
            <Animated.View style={{ shadowColor: glowColor, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 20, elevation: 10 }}>
              <TouchableOpacity
                onPress={handleVisualize}
                disabled={isGenerating || isTranscribing}
                style={{
                  backgroundColor: isGenerating || isTranscribing ? "rgba(102,126,234,0.6)" : "#667eea",
                  borderRadius: 25,
                  paddingVertical: 18,
                  alignItems: "center",
                }}
              >
                <Sparkles size={24} color="#fff" style={{ marginBottom: -4 }} />
                <Text style={{ fontSize: 18, fontFamily: "Montserrat_600SemiBold", color: "#fff", marginTop: 4 }}>
                  {isGenerating ? "Visualizing..." : "Visualize Dream"}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}