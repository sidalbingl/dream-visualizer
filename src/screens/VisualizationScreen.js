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
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { Video } from 'expo-av';
import { useUser } from '../context/UserContext';

const VisualizationScreen = ({ navigation, route }) => {
  const { dreamText, style, timestamp } = route.params;

  const [isGenerating, setIsGenerating] = useState(true);
  const [generatedMedia, setGeneratedMedia] = useState(null);
  const [aiComment, setAiComment] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const { isPremium } = useUser();

  const BASE_URL = "https://pectous-equicontinuous-alec.ngrok-free.dev";

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

      // Görselleştirme tamamlandıktan sonra rüya yorumunu al
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
          "ngrok-skip-browser-warning": "true",
          "Accept": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📡 Response status:", res.status);

      const responseText = await res.text();
      console.log("📄 Response text (ilk 500 karakter):", responseText.substring(0, 500));

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("❌ JSON parse hatası:", parseError);
        throw new Error("Server JSON yerine HTML döndürdü. Ngrok URL'nizi kontrol edin.");
      }

      console.log("✅ Parsed data:", data);

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      if (isPremium) {
        if (!data.videoUrl) {
          throw new Error("No video URL returned");
        }
        console.log("🎬 Video URL:", data.videoUrl);
        setGeneratedMedia({ type: "video", url: data.videoUrl });
      } else {
        if (!data.imageUrl) {
          throw new Error("No image URL returned");
        }
        console.log("🖼 Image URL:", data.imageUrl);
        setGeneratedMedia({ type: "image", url: data.imageUrl });
      }

    } catch (err) {
      console.error("❌ Generation error:", err.message);
      throw err;
    }
  };

  const generateAIComment = async () => {
    try {
      setIsAnalyzing(true);
      console.log("🔮 Rüya yorumlama başlıyor...");

      const API_URL = `${BASE_URL}/api/analyze-dream`;

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          dreamText: dreamText,
          isPremium: isPremium,
        }),
      });

      const responseText = await res.text();
      console.log("📄 Analysis response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("❌ JSON parse hatası:", parseError);
        throw new Error("Server JSON yerine HTML döndürdü");
      }

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      if (!data.analysis) {
        throw new Error("No analysis returned");
      }

      console.log("✅ Rüya yorumu alındı");
      console.log("📝 Yorum uzunluğu:", data.wordCount, "kelime");

      setAiComment(data.analysis);
      setIsAnalyzing(false);

    } catch (err) {
      console.error("❌ Analysis error:", err.message);
      setIsAnalyzing(false);

      // Fallback yorum (API hatası durumunda)
      if (isPremium) {
        setAiComment("Premium rüya yorumu alınamadı. Lütfen tekrar deneyin veya bağlantınızı kontrol edin.");
      } else {
        setAiComment("Rüya yorumu alınamadı. Lütfen tekrar deneyin.");
      }
    }
  };

  const handleSaveToFavorites = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Login required', 'Please login to save favorites');
        return;
      }

      if (!generatedMedia || !aiComment) {
        Alert.alert('Please wait', 'Media and AI comment must be ready');
        return;
      }

      const summary = dreamText.length > 120 ? `${dreamText.slice(0, 117)}...` : dreamText;
      const titleDate = new Date().toLocaleDateString('tr-TR', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      const payload = {
        dreamText,
        mediaType: generatedMedia.type === 'video' ? 'video' : 'image',
        mediaUrl: generatedMedia.url,
        aiComment,
        summary,
        posterUrl: generatedMedia.url, // ✅ Her durumda mediaUrl'yi posterUrl olarak kullan
        titleDate,
        date: serverTimestamp(),
        isFavorite: false, 
      };

      await addDoc(collection(db, 'users', user.uid, 'dreams'), payload);
      setIsFavorite(true);
      
      Alert.alert(
        'Kaydedildi', 
        'Rüya favorilere eklendi',
        [
          {
            text: 'Tamam',
            onPress: () => {
              // ✅ MainTabs içindeki Gallery tab'ine git
              navigation.navigate('MainTabs', { 
                screen: 'Gallery' 
              });
            }
          }
        ]
      );
    } catch (error) {
      console.error('Save favorite error:', error);
      Alert.alert('Hata', 'Favorilere kaydedilemedi');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my dream visualization: "${dreamText}"\n\nAI Analysis: ${aiComment.substring(0, 100)}...`,
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
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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

        {/* AI Comment Loading */}
        {isAnalyzing && (
          <View style={styles.commentContainer}>
            <ActivityIndicator size="small" color="#6366f1" />
            <Text style={styles.analyzingText}>
              {isPremium ? "Analyzing your dream deeply..." : "Analyzing your dream..."}
            </Text>
          </View>
        )}

        {/* AI Comment */}
        {aiComment && !isAnalyzing && (
          <View style={styles.commentContainer}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentLabel}>
                {isPremium ? "🔮 Premium Dream Analysis" : "💭 Dream Analysis"}
              </Text>
              {isPremium && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumBadgeText}>PREMIUM</Text>
                </View>
              )}
            </View>
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
              disabled={isFavorite}
            >
              <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
              <Text style={styles.favoriteText}>{isFavorite ? 'Saved' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  commentLabel: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  premiumBadge: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  premiumBadgeText: { fontSize: 10, fontWeight: 'bold', color: 'white' },
  commentText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
  analyzingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 12,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingBottom: 40,
  },
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