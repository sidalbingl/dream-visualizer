import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Ionicons,
  FontAwesome5,
  Entypo,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";

const { width, height } = Dimensions.get("window");

const onboardingData = [
  {
    id: 1,
    uri:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA8V3ynQGv6rO0UQH3mECI1_x_XX7mNiEacidK53IQGeEnD25v9SUWJsF6ycktJety1rlxYS3OQNMC4zRNTrLiP4_RT9jx31Uy3OT_2a9Ha2a_BJ-lUv-Z0PQvVlH0_C1TGHzBFz2TNhVVQHSsYNFYGuC1GXha9nwIrJybZ9JXLwD6nLbwpSj5rKySsEIZpaYg4morXjpUeD1L1og3Y7blprZYDexDuJg8NGJ_eFGVaheyms622JE0D_k_l9Wmj0zxeJEC8O9MP9s4",
    title: "Every dream hides a message.",
    description: "What if you could finally understand yours?",
  },
  {
    id: 2,
    uri:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBEByh-80UQCbbvEqNlfHRT2UN11dD1jn2TFjy2Pp5H6YvFPu1KCuIjIfZfhlUqX5SXDmVKG_CSFiS2DF6o-C_KaEOFkvfAACdbbxAdsCuaZCz_5aHlZYcWXc_gBCis1nf6YgSh66LKVA1yylbxemTuKKZJqOmEGdwAHwOQq19MfVflseA45y7YJhaUA-nzlH8w-vSYq3iEGHSVEGUP6_46AxhZhN1q3lI_7s2UiyAHlbggwtpAoERDHLY3OO5Poml2JWI81TqHfko",
    title: "We forget 95% of our dreams... but our mind doesn’t.",
    description: "Your subconscious still remembers.",
  },
  {
    id: 3,
    uri:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA7jHlXJ9Bh_ynGLrNRj-LPIbvOOHzSxZcMf7iUNv0gcLnZWIlAPxy7Th3NURvVQUG4hbk7CT1yPM809LFlu_s56F80g8sWCoNC4sCWJCom1QyZGDWIQh4FNRpqE0-x_oKvRA4zrRHjk1xIebSCJOwH2ash2DSs74m06522w2uMahZjDtlOkf7Ic6NfirkYb5UX_OAnF9PEue4-sXgUuAjwZPyquRCtyNjzlqq8PYStXB4Al4WGhSufn4L4N0NG0SLaNJkWcIQIFHo",
    title: "Wake up and remember.",
    description:
      "Have you noticed how quickly your dreams fade away each morning? Keep those precious moments forever.",
  },
  {
    id: 4,
    local: require("../../assets/splash.png"),
    title:
      "Dream Visualizer helps you decode your dreams through AI.",
    description:
      "Get personalized insights, patterns, and meanings — instantly.",
  },
  {
    id: 5,
    glowingEye: true,
  },
];

export default function OnboardingScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  // glowing efekt animasyonu
  const glowAnim = useRef(new Animated.Value(0.5)).current;
  // gradient hareket animasyonu
  const gradientAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // glow loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();

    // gradient “nefes alma” hareketi
    Animated.loop(
      Animated.sequence([
        Animated.timing(gradientAnim, {
          toValue: 1,
          duration: 6000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(gradientAnim, {
          toValue: 0,
          duration: 6000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });
  if (!fontsLoaded) return null;

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const handleStart = () => {
    navigation.reset({ index: 0, routes: [{ name: "Register" }] });
  };

  // gradient hareketi için renkler
  const animatedColors = gradientAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#0E0A1A", "#1C1530"],
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      >
        {onboardingData.map((item, index) => {
          if (item.glowingEye) {
            return (
              <Animated.View
                key={index}
                style={[
                  styles.slide,
                  {
                    justifyContent: "space-between",
                    backgroundColor: animatedColors,
                  },
                ]}
              >
                {/* Yanıp sönmeli göz */}
                <Animated.View
                  style={[
                    styles.eyeGlowContainer,
                    { opacity: glowAnim, shadowOpacity: glowAnim },
                  ]}
                >
                  <Feather name="eye" size={80} color="#fff" />
                </Animated.View>

                {/* İçerik */}
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <Text style={styles.title}>Use Dream Visualizer</Text>

                  <View style={styles.iconGrid}>
                    <View style={styles.iconItem}>
                      <Ionicons name="mic-outline" size={30} color="#fff" />
                      <Text style={styles.iconText}>
                        Instantly tell your dream with your microphone when you wake up.
                      </Text>
                    </View>

                    <View style={styles.iconItem}>
                      <FontAwesome5 name="image" size={28} color="#fff" />
                      <Text style={styles.iconText}>
                        FAL AI generates a visual or video of your dream.
                      </Text>
                    </View>

                    <View style={styles.iconItem}>
                      <Entypo name="heart-outlined" size={28} color="#fff" />
                      <Text style={styles.iconText}>
                        Save your dreams to your dream journal.
                      </Text>
                    </View>

                    <View style={styles.iconItem}>
                      <MaterialCommunityIcons
                        name="file-document-outline"
                        size={30}
                        color="#fff"
                      />
                      <Text style={styles.iconText}>
                        See the interpretation of your dream.
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                  <Text style={styles.startButtonText}>Get Started</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          }

          const source = item.local ? item.local : { uri: item.uri };
          return (
            <View key={index} style={styles.slide}>
              <ImageBackground
                source={source}
                style={styles.halfImage}
                resizeMode="cover"
              >
                <LinearGradient
                  colors={[
                    "rgba(22,16,34,0.0)",
                    "rgba(22,16,34,0.6)",
                    "rgba(22,16,34,1)",
                  ]}
                  style={StyleSheet.absoluteFill}
                />
              </ImageBackground>

              <View style={[styles.textContainer, { paddingBottom: insets.bottom + 60 }]}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Dots */}
      <View style={[styles.dotsWrapper, { bottom: insets.bottom + 20 }]}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentIndex
                    ? "#764ba2"
                    : "rgba(255, 255, 255, 0.3)",
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#161022" },
  slide: { width, height, alignItems: "center", paddingVertical: 40 },
  halfImage: { height: height * 0.6, width: "100%" },
  textContainer: { paddingHorizontal: 30, alignItems: "center" },
  title: {
    fontSize: 24,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
  },
  dotsWrapper: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 5 },

  // glowing eye efekt
  eyeGlowContainer: {
    position: "absolute",
    top: height * 0.12,
    alignSelf: "center",
    shadowColor: "#5211d4",
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 0 },
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    rowGap: 20,
    width: "90%",
    marginTop: 40,
  },
  iconItem: {
    width: "45%",
    alignItems: "center",
  },
  iconText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
  },
  startButton: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 14,
    width: "85%",
    alignSelf: "center",
    marginBottom: 40,
  },
  startButtonText: {
    color: "#161022",
    textAlign: "center",
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
});