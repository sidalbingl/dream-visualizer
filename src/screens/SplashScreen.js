import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  Easing,
  useColorScheme,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Cloud, Moon, Sparkles } from "lucide-react-native";
import {
  useFonts
} from "expo-font";
import {
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold
} from "@expo-google-fonts/montserrat";

export default function SplashScreen({ navigation }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const cloudAnim = useRef(new Animated.Value(-50)).current;
  const moonAnim = useRef(new Animated.Value(-100)).current;
  const sparklesAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(50)).current;

  const [fontsLoaded] = useFonts({
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
  });

  useEffect(() => {
    if (!fontsLoaded) return;

    // Start animations
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1200,
      easing: Easing.elastic(1.2),
      useNativeDriver: true,
    }).start();

    Animated.timing(cloudAnim, {
      toValue: 0,
      duration: 1500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.timing(moonAnim, {
      toValue: 0,
      duration: 1800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.timing(textAnim, {
      toValue: 0,
      duration: 1000,
      delay: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const sparklesLoop = Animated.loop(
      Animated.timing(sparklesAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    sparklesLoop.start();

    // Navigate after animation
    const timeout = setTimeout(() => {
      navigation.replace("Paywall");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const sparklesRotation = sparklesAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <LinearGradient
        colors={
          isDark
            ? ["#1a1a2e", "#16213e", "#0f1419", "#1a1a2e"]
            : ["#667eea", "#764ba2", "#f093fb", "#667eea"]
        }
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <StatusBar style="light" />

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 40,
          }}
        >
          {/* Floating Elements */}
          <View style={{ position: "absolute", top: "20%", left: "10%" }}>
            <Animated.View style={{ transform: [{ translateY: cloudAnim }] }}>
              <Cloud size={40} color="rgba(255, 255, 255, 0.3)" />
            </Animated.View>
          </View>

          <View style={{ position: "absolute", top: "15%", right: "15%" }}>
            <Animated.View style={{ transform: [{ translateY: moonAnim }] }}>
              <Moon size={35} color="rgba(255, 255, 255, 0.4)" />
            </Animated.View>
          </View>

          <View style={{ position: "absolute", bottom: "25%", left: "20%" }}>
            <Animated.View style={{ transform: [{ rotate: sparklesRotation }] }}>
              <Sparkles size={30} color="rgba(255, 255, 255, 0.5)" />
            </Animated.View>
          </View>

          {/* Logo */}
          <Animated.View
            style={{ alignItems: "center", transform: [{ scale: scaleAnim }] }}
          >
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderWidth: 2,
                borderColor: "rgba(255, 255, 255, 0.3)",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 30,
              }}
            >
              <Cloud size={50} color="#FFFFFF" />
              <View style={{ position: "absolute", top: 30, right: 25 }}>
                <Sparkles size={20} color="rgba(255, 255, 255, 0.8)" />
              </View>
            </View>

            {/* Title */}
            <Animated.View
              style={{ alignItems: "center", transform: [{ translateY: textAnim }] }}
            >
              <Text
                style={{
                  fontSize: 32,
                  fontFamily: "Montserrat_700Bold",
                  color: "#FFFFFF",
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                Dream Visualizer
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Montserrat_400Regular",
                  color: "rgba(255, 255, 255, 0.8)",
                  textAlign: "center",
                }}
              >
                Bring your dreams to life with AI
              </Text>
            </Animated.View>
          </Animated.View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}
