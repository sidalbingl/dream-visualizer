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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Mic, Sparkles, MicOff } from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";

export default function DreamInputScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [dreamText, setDreamText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Animation values
  const glowAnimation = useRef(new Animated.Value(0)).current;
  const micPulse = useRef(new Animated.Value(1)).current;

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    // Continuous glow animation for the visualize button
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    );
    glowLoop.start();

    return () => glowLoop.stop();
  }, []);

  useEffect(() => {
    if (isRecording) {
      const micLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(micPulse, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(micPulse, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      micLoop.start();
      return () => micLoop.stop();
    }
  }, [isRecording]);

  if (!fontsLoaded) {
    return null;
  }

  const handleMicPress = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate voice-to-text completion
      setDreamText(dreamText + " I was flying through a starlit sky...");
    } else {
      setIsRecording(true);
    }
  };

  const handleVisualize = async () => {
    if (!dreamText.trim()) {
      Alert.alert(
        "Please describe your dream",
        "Enter some text or use voice recording to describe your dream."
      );
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Navigate to Visualization screen
      navigation.navigate("Visualization", {
        dreamText: dreamText.trim(),
        style: "realistic",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      Alert.alert("Error", "Failed to generate dream visualization. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const glowColor = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(102, 126, 234, 0.3)", "rgba(102, 126, 234, 0.8)"],
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        style={{ flex: 1 }}
      >
        <StatusBar style="light" />

        {/* Header */}
        <View
          style={{
            paddingTop: insets.top + 16,
            paddingHorizontal: 20,
            paddingBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontFamily: "Inter_600SemiBold",
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            Dream Visualizer
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_400Regular",
              color: "rgba(255, 255, 255, 0.8)",
              textAlign: "center",
              marginTop: 4,
            }}
          >
            Bring your dreams to life
          </Text>
        </View>

        {/* Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              paddingVertical: 40,
            }}
          >
            {/* Dream Input Card */}
            <View
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: 20,
                padding: 24,
                marginBottom: 40,
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Inter_600SemiBold",
                  color: "#FFFFFF",
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                Describe Your Dream
              </Text>

              {/* Text Input with Mic */}
              <View style={{ position: "relative" }}>
                <TextInput
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: 16,
                    padding: 20,
                    paddingRight: 60,
                    fontSize: 16,
                    fontFamily: "Inter_400Regular",
                    color: "#333",
                    minHeight: 120,
                    textAlignVertical: "top",
                  }}
                  placeholder="Describe your dream..."
                  placeholderTextColor="#999"
                  multiline
                  value={dreamText}
                  onChangeText={setDreamText}
                />

                {/* Mic Button */}
                <TouchableOpacity
                  onPress={handleMicPress}
                  style={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: isRecording ? "#f87171" : "#667eea",
                    justifyContent: "center",
                    alignItems: "center",
                    transform: [{ scale: micPulse }],
                  }}
                >
                  {isRecording ? (
                    <MicOff size={20} color="#FFFFFF" />
                  ) : (
                    <Mic size={20} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              </View>

              {isRecording && (
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Inter_500Medium",
                    color: "#f87171",
                    textAlign: "center",
                    marginTop: 12,
                  }}
                >
                  Recording... Tap mic to stop
                </Text>
              )}
            </View>

            {/* Visualize Button */}
            <Animated.View
              style={{
                shadowColor: glowColor,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 1,
                shadowRadius: 20,
                elevation: 10,
              }}
            >
              <TouchableOpacity
                onPress={handleVisualize}
                disabled={isGenerating}
                style={{
                  backgroundColor: isGenerating
                    ? "rgba(102, 126, 234, 0.6)"
                    : "#667eea",
                  borderRadius: 25,
                  paddingVertical: 18,
                  paddingHorizontal: 32,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.3)",
                }}
              >
                <Sparkles size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: "Inter_600SemiBold",
                    color: "#FFFFFF",
                  }}
                >
                  {isGenerating ? "Visualizing..." : "Visualize Dream"}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Recent Dreams */}
            <View style={{ marginTop: 60 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Inter_600SemiBold",
                  color: "#FFFFFF",
                  marginBottom: 16,
                }}
              >
                Recent Dreams
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 4 }}
              >
                {[
                  "Flying through clouds",
                  "Walking in a mystical forest",
                  "Swimming with dolphins",
                ].map((dream, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setDreamText(dream)}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: 12,
                      padding: 16,
                      marginRight: 12,
                      minWidth: 120,
                      borderWidth: 1,
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Inter_500Medium",
                        color: "#FFFFFF",
                        textAlign: "center",
                      }}
                    >
                      {dream}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
