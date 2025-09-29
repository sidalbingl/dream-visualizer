import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

const DreamInputScreen = ({ navigation }) => {
  const [dreamText, setDreamText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('realistic');

  const visualizationStyles = [
    { id: 'realistic', name: 'Realistic', icon: '🎭' },
    { id: 'anime', name: 'Anime', icon: '🎌' },
    { id: 'painterly', name: 'Painterly', icon: '🎨' },
    { id: 'surreal', name: 'Surreal', icon: '🌌' },
    { id: 'minimalist', name: 'Minimalist', icon: '⚪' }
  ];

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow microphone access to record your dream.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    
    // TODO: Convert audio to text using speech-to-text service
    Alert.alert('Audio Recorded', 'Audio-to-text conversion will be implemented with speech recognition service');
    
    setRecording(null);
  };

  const handleSubmit = () => {
    if (!dreamText.trim()) {
      Alert.alert('Empty Dream', 'Please describe your dream before visualizing it.');
      return;
    }

    if (dreamText.length < 10) {
      Alert.alert('Too Short', 'Please provide a more detailed description of your dream (at least 10 characters).');
      return;
    }

    // Navigate to visualization screen with dream data
    navigation.navigate('Visualization', {
      dreamText: dreamText.trim(),
      style: selectedStyle,
      timestamp: new Date().toISOString()
    });
  };

  const handleTextToSpeech = () => {
    if (dreamText.trim()) {
      Speech.speak(dreamText, {
        language: 'en',
        pitch: 1.0,
        rate: 0.8,
      });
    }
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <StatusBar style="light" />
      
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Describe Your Dream</Text>
          <Text style={styles.subtitle}>Share your dream and watch it come to life</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Dream Description</Text>
          <TextInput
            style={styles.textInput}
            placeholder="I was flying over a magical forest with glowing trees and colorful butterflies..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={dreamText}
            onChangeText={setDreamText}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{dreamText.length}/500</Text>
        </View>

        {/* Style Selection */}
        <View style={styles.styleContainer}>
          <Text style={styles.styleLabel}>Visualization Style</Text>
          <View style={styles.styleGrid}>
            {visualizationStyles.map((style) => (
              <TouchableOpacity
                key={style.id}
                style={[
                  styles.styleButton,
                  selectedStyle === style.id && styles.styleButtonActive
                ]}
                onPress={() => setSelectedStyle(style.id)}
              >
                <Text style={styles.styleIcon}>{style.icon}</Text>
                <Text style={[
                  styles.styleName,
                  selectedStyle === style.id && styles.styleNameActive
                ]}>
                  {style.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Voice Recording */}
        <View style={styles.voiceContainer}>
          <Text style={styles.voiceLabel}>Voice Recording</Text>
          <View style={styles.voiceButtons}>
            <TouchableOpacity
              style={[styles.voiceButton, isRecording && styles.voiceButtonRecording]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Text style={styles.voiceIcon}>
                {isRecording ? '⏹️' : '🎤'}
              </Text>
              <Text style={styles.voiceText}>
                {isRecording ? 'Stop Recording' : 'Record Voice'}
              </Text>
            </TouchableOpacity>
            
            {dreamText.trim() && (
              <TouchableOpacity
                style={styles.voiceButton}
                onPress={handleTextToSpeech}
              >
                <Text style={styles.voiceIcon}>🔊</Text>
                <Text style={styles.voiceText}>Play</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.favoritesButton}
            onPress={() => navigation.navigate('Favorites')}
          >
            <Text style={styles.favoritesText}>View Favorites</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              style={styles.submitButtonGradient}
            >
              <Text style={styles.submitText}>Visualize Dream</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};


export default DreamInputScreen;
