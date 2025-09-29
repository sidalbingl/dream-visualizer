import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const OnboardingScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Dream Visualizer",
      description: "Transform your dreams into stunning AI-generated visualizations",
      icon: "🌟"
    },
    {
      title: "Record Your Dreams",
      description: "Share your dreams through text or voice recording",
      icon: "📝"
    },
    {
      title: "AI Magic",
      description: "Watch as AI brings your dreams to life with beautiful animations",
      icon: "✨"
    },
    {
      title: "Premium Features",
      description: "Unlock exclusive styles, AR view, and high-resolution exports",
      icon: "👑"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Show paywall before going to main app
      navigation.navigate('Paywall');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Paywall');
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <StatusBar style="light" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.icon}>{steps[currentStep].icon}</Text>
          <Text style={styles.title}>{steps[currentStep].title}</Text>
          <Text style={styles.description}>{steps[currentStep].description}</Text>
        </View>

        {/* Demo Section */}
        <View style={styles.demoContainer}>
          <Text style={styles.demoTitle}>See It In Action</Text>
          <View style={styles.demoBox}>
            <Text style={styles.demoText}>"I was flying over a magical forest with glowing trees..."</Text>
            <View style={styles.demoAnimation}>
              <Text style={styles.demoIcon}>🎬</Text>
              <Text style={styles.demoLabel}>AI Animation</Text>
            </View>
          </View>
        </View>

        {/* Step Indicators */}
        <View style={styles.stepContainer}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.stepDot,
                index === currentStep && styles.stepDotActive
              ]}
            />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextText}>
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  icon: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  demoContainer: {
    marginVertical: 40,
    paddingHorizontal: 20,
  },
  demoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  demoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  demoText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  demoAnimation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  demoLabel: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
  },
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  stepDotActive: {
    backgroundColor: '#6366f1',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
  },
  nextButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  nextText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen;
