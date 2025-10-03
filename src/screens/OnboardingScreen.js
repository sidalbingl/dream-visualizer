import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Cloud, Moon, Sparkles, ArrowRight } from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";

const { width } = Dimensions.get("window");

const onboardingData = [
  {
    icon: Cloud,
    title: "Describe or Speak Your Dream",
    description: "Type freely or use instant voice-to-text to capture your dream.",
    features: [
      "Fast speech-to-text transcription",
      "Multilingual input support",
      "Edit before generating",
    ],
    colors: ["#667eea", "#764ba2"],
  },
  {
    icon: Sparkles,
    title: "AI Visualizes Your Dream",
    description: "See your dream as stunning AI visuals.",
    features: [
      "Image generation for everyone",
      "Premium: cinematic AI video",
      "Style presets (realistic, anime, surreal...)",
    ],
    badge: "PREMIUM",
    colors: ["#f093fb", "#f5576c"],
  },
  {
    icon: Moon,
    title: "AI Dream Interpretation",
    description: "Understand symbolism and themes with rich AI commentary.",
    features: [
      "Concise, readable insights",
      "Deeper analysis for premium",
      "Shareable summary",
    ],
    colors: ["#4facfe", "#00f2fe"],
  },
  {
    icon: Cloud,
    title: "Favorites & Secure Cloud Sync",
    description: "Save the best dreams and access them anywhere.",
    features: [
      "Saved per user in Firestore",
      "Title by date + automatic summary",
      "Media + AI comment in detail view",
    ],
    colors: ["#22c1c3", "#fdbb2d"],
  },
  {
    icon: Sparkles,
    title: "Ready to Dream Big?",
    description: "Create your account to start visualizing and interpreting.",
    features: [
      "Free tier: AI images + analysis",
      "Premium: video + advanced insights",
      "Private by design",
    ],
    colors: ["#8EC5FC", "#E0C3FC"],
  },
];

export default function OnboardingScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: width * nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    } else {
      navigation.reset({ index: 0, routes: [{ name: "Register" }] });
    }
  };

  const handleSkip = () => {
    navigation.reset({ index: 0, routes: [{ name: "Register" }] });
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const currentData = onboardingData[currentIndex];

  return (
    <LinearGradient
      colors={currentData.colors}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar style="light" />

      {/* Skip Button */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          alignItems: "flex-end",
          zIndex: 10,
        }}
      >
        <TouchableOpacity onPress={handleSkip}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_500Medium",
              color: "rgba(255, 255, 255, 0.8)",
            }}
          >
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {onboardingData.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <View
              key={index}
              style={{
                width: width,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 40,
              }}
            >
              {/* Logo/Icon */}
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 60,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.3,
                  shadowRadius: 20,
                }}
              >
                <IconComponent size={48} color="#FFFFFF" />
              </View>

              {/* Title */}
              <Text
                style={{
                  fontSize: 32,
                  fontFamily: "Inter_600SemiBold",
                  color: "#FFFFFF",
                  textAlign: "center",
                  marginBottom: 20,
                  lineHeight: 40,
                }}
              >
                {item.title}
              </Text>

              {/* Description */}
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Inter_400Regular",
                  color: "rgba(255, 255, 255, 0.9)",
                  textAlign: "center",
                  lineHeight: 26,
                  marginBottom: item?.features ? 16 : 60,
                }}
              >
                {item.description}
              </Text>

              {/* Optional Badge */}
              {item?.badge ? (
                <View style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderColor: "rgba(255,255,255,0.35)",
                  borderWidth: 1,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 8,
                  marginBottom: 10,
                }}>
                  <Text style={{ color: "#fff", fontFamily: "Inter_500Medium", fontSize: 12 }}>{item.badge}</Text>
                </View>
              ) : null}

              {/* Feature bullets */}
              {item?.features ? (
                <View style={{ width: "100%", marginBottom: 36 }}>
                  {item.features.map((f, i2) => (
                    <View key={i2} style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 8 }}>
                      <Text style={{ color: "#fff", fontSize: 14, marginRight: 8 }}>•</Text>
                      <Text style={{ color: "#fff", fontSize: 14, flex: 1, opacity: 0.9 }}>{f}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          );
        })}
      </ScrollView>

      {/* Progress Dots */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 40,
        }}
      >
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor:
                index === currentIndex
                  ? "#FFFFFF"
                  : "rgba(255, 255, 255, 0.4)",
              marginHorizontal: 4,
            }}
          />
        ))}
      </View>

      {/* Next Button */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20,
        }}
      >
        <TouchableOpacity
          onPress={handleNext}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: 25,
            paddingVertical: 16,
            paddingHorizontal: 24,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.3)",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Inter_600SemiBold",
              color: "#FFFFFF",
              marginRight: 8,
            }}
          >
            {currentIndex === onboardingData.length - 1
              ? "Create Account"
              : "Next"}
          </Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}