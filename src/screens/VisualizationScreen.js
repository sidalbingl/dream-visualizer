import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';
import { useUser } from '../context/UserContext';

const VisualizationScreen = ({ navigation, route }) => {
  const { dreamText, style, timestamp } = route.params;

  const [isGenerating, setIsGenerating] = useState(true);
  const [generatedMedia, setGeneratedMedia] = useState(null);
  const [aiComment, setAiComment] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const { isPremium } = useUser();

  useEffect(() => {
    generateVisualization();
  }, []);

  const generateVisualization = async () => {
    try {
      setIsGenerating(true);
      setGenerationProgress(0);

      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await simulateFALAPICall();

      clearInterval(progressInterval);
      setGenerationProgress(100);

      await generateAIComment();

      setIsGenerating(false);
    } catch (error) {
      Alert.alert('Generation Failed', error.message || 'Please try again.');
      setIsGenerating(false);
    }
  };

  const simulateFALAPICall = async () => {
    try {
      console.log("🚀 Generation başlıyor...");
      console.log("💎 Premium:", isPremium);
      
      // URL'yi doğru şekilde oluştur (sonunda slash olmamalı)
      const BASE_URL = "https://pectous-equicontinuous-alec.ngrok-free.dev";
      const endpoint = isPremium ? "/api/generate-video" : "/api/generate-image";
      const API_URL = BASE_URL + endpoint;

      console.log("🔗 API URL:", API_URL);

      const requestBody = {
        prompt: `A dreamlike, surreal visualization of: ${dreamText}`,
        isPremium: isPremium,
      };

      console.log("📦 Request body:", requestBody);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
          "Accept": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📡 Response status:", res.status);
      console.log("📡 Response headers:", {
        contentType: res.headers.get("content-type"),
        status: res.status,
      });

      // İlk önce text olarak oku
      const responseText = await res.text();
      console.log("📄 Response text (ilk 500 karakter):", responseText.substring(0, 500));

      // JSON parse et
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("❌ JSON parse hatası:", parseError);
        console.error("❌ Response text:", responseText);
        throw new Error("Server JSON yerine HTML döndürdü. Ngrok URL'nizi kontrol edin.");
      }

      console.log("✅ Parsed data:", data);

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      if (isPremium) {
        if (!data.videoUrl) {
          console.error("❌ Video URL yok:", data);
          throw new Error("No video URL returned");
        }
        console.log("🎬 Video URL:", data.videoUrl);
        setGeneratedMedia({ type: "video", url: data.videoUrl });
      } else {
        if (!data.imageUrl) {
          console.error("❌ Image URL yok:", data);
          throw new Error("No image URL returned");
        }
        console.log("🖼️ Image URL:", data.imageUrl);
        setGeneratedMedia({ type: "image", url: data.imageUrl });
      }
      
    } catch (err) {
      console.error("❌ Generation error:", err.message);
      console.error("❌ Full error:", err);
      throw err;
    }
  };

  const generateAIComment = async () => {
    if (isPremium) {
      const premiumComments = [
        "Premium uzun yorum: Bu rüya bilinçaltındaki özgürlük arzusunu derinlemesine gösteriyor.",
        "Premium uzun yorum: Hayatında yeni bir dönüşüm dönemi yaşıyorsun.",
        "Premium uzun yorum: Yaratıcılığın yükseliyor, bu rüya hayal gücünün güçlü işaretlerini taşıyor."
      ];
      setAiComment(premiumComments[Math.floor(Math.random() * premiumComments.length)]);
    } else {
      setAiComment("Standart kısa yorum: Bu rüya özgürlük arayışını gösteriyor.");
    }
  };

  const handleSaveToFavorites = async () => {
    try {
      const dreamData = {
        id: Date.now().toString(),
        dreamText,
        style,
        timestamp,
        mediaUrl: generatedMedia?.url,
        aiComment,
        createdAt: new Date().toISOString(),
        type: generatedMedia?.type,
      };

      const existingFavorites = await AsyncStorage.getItem('favorites');
      const favorites = existingFavorites ? JSON.parse(existingFavorites) : [];
      favorites.push(dreamData);

      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
      Alert.alert('Saved!', 'Dream added to your favorites');
    } catch (error) {
      Alert.alert('Error', 'Failed to save to favorites');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my dream visualization: "${dreamText}"`,
        title: 'My Dream Visualization',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share');
    }
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setGeneratedMedia(null);
    setAiComment('');
    setGenerationProgress(0);
    generateVisualization();
  };

  const getStyleIcon = (styleName) => {
    const styleIcons = {
      realistic: '🎭',
      anime: '🎌',
      painterly: '🎨',
      surreal: '🌌',
      minimalist: '⚪',
    };
    return styleIcons[styleName] || '🎨';
  };

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dream Visualization</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareIcon}>📤</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Dream Text */}
        <View style={styles.dreamContainer}>
          <Text style={styles.dreamLabel}>Your Dream</Text>
          <Text style={styles.dreamText}>"{dreamText}"</Text>
          <View style={styles.styleInfo}>
            <Text style={styles.styleIcon}>{getStyleIcon(style)}</Text>
            <Text style={styles.styleText}>
              {style.charAt(0).toUpperCase() + style.slice(1)} Style
            </Text>
          </View>
        </View>

        {/* Progress */}
        {isGenerating && (
          <View style={styles.generationContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.generationText}>Generating your dream visualization...</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${generationProgress}%` }]} />
            </View>
            <Text style={styles.progressText}>{generationProgress}%</Text>
          </View>
        )}

        {/* Media */}
        {generatedMedia && !isGenerating && (
          <View style={styles.imageContainer}>
            {generatedMedia.type === "video" ? (
              <Video
                source={{ uri: generatedMedia.url }}
                style={styles.generatedImage}
                useNativeControls
                resizeMode="contain"
                shouldPlay
                isLooping
              />
            ) : (
              <>
                <Image source={{ uri: generatedMedia.url }} style={styles.generatedImage} />
                <View style={styles.imageOverlay}>
                  <Text style={styles.imageLabel}>AI Generated Visualization</Text>
                </View>
              </>
            )}
          </View>
        )}

        {/* AI Comment */}
        {aiComment && !isGenerating && (
          <View style={styles.commentContainer}>
            <Text style={styles.commentLabel}>AI Dream Analysis</Text>
            <Text style={styles.commentText}>{aiComment}</Text>
          </View>
        )}

        {/* Action Buttons */}
        {!isGenerating && (
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.regenerateButton} onPress={handleRegenerate}>
              <Text style={styles.regenerateIcon}>🔄</Text>
              <Text style={styles.regenerateText}>Regenerate</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
              onPress={handleSaveToFavorites}
            >
              <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
              <Text style={styles.favoriteText}>{isFavorite ? 'Saved' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: { padding: 8 },
  backIcon: { fontSize: 24, color: 'white' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  shareButton: { padding: 8 },
  shareIcon: { fontSize: 20 },
  content: { flex: 1, paddingHorizontal: 20 },
  dreamContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dreamLabel: { fontSize: 14, color: 'rgba(255, 255, 255, 0.7)', marginBottom: 8 },
  dreamText: {
    fontSize: 16,
    color: 'white',
    lineHeight: 24,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  styleInfo: { flexDirection: 'row', alignItems: 'center' },
  styleIcon: { fontSize: 16, marginRight: 8 },
  styleText: { fontSize: 14, color: '#6366f1', fontWeight: '600' },
  generationContainer: { alignItems: 'center', paddingVertical: 40 },
  generationText: { fontSize: 16, color: 'white', marginTop: 16, marginBottom: 20, textAlign: 'center' },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: { height: '100%', backgroundColor: '#6366f1', borderRadius: 2 },
  progressText: { fontSize: 14, color: 'rgba(255, 255, 255, 0.7)' },
  imageContainer: { alignItems: 'center', marginBottom: 20 },
  generatedImage: { width: '100%', height: 300, borderRadius: 16 },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  imageLabel: { color: 'white', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  commentContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  commentLabel: { fontSize: 16, fontWeight: 'bold', color: 'white', marginBottom: 12 },
  commentText: { fontSize: 14, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 20 },
  actionContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20 },
  regenerateButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 0.48,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  regenerateIcon: { fontSize: 20, marginBottom: 4 },
  regenerateText: { fontSize: 14, color: 'white' },
  favoriteButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 0.48,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  favoriteButtonActive: { backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: '#ef4444' },
  favoriteIcon: { fontSize: 20, marginBottom: 4 },
  favoriteText: { fontSize: 14, color: 'white' },
});

export default VisualizationScreen;