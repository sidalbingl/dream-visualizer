import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Video } from 'expo-av';
import AdaptyService from '../services/AdaptyService';
import AdaptyConstans from '../../AdaptyConstans';

const PaywallScreen = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [showMock, setShowMock] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const prof = await AdaptyService.getProfile();
        setProfile(prof);
      } catch (e) {
        console.warn('Adapty profile load error', e);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const features = [
    { icon: '🎬', title: 'Dream to Video', description: 'Turn your written dreams into vivid AI-generated videos' },
    { icon: '📝', title: 'Extended Interpretations', description: 'Get longer and more detailed dream interpretations' },
    { icon: '📺', title: 'High-Quality Exports', description: 'Download your dream videos in stunning 4K resolution' }
  ];

  const selectedProduct = useMemo(() => {
    if (!products.length) return null;
    if (selectedPlan === 'yearly') {
      return products.find(p => p.subscriptionPeriod?.unit === 'year') || products[0];
    }
    return products.find(p => p.subscriptionPeriod?.unit === 'month') || products[0];
  }, [products, selectedPlan]);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const { presented } = await AdaptyService.presentNoCodePaywall();
      if (!presented) {
        setShowMock(true);
        return;
      }
      const updated = await AdaptyService.getProfile();
      setProfile(updated);
      const isPremium = updated?.accessLevels?.[AdaptyConstans.ACCESS_LEVEL_ID]?.isActive;
      if (isPremium) {
        Alert.alert('Teşekkürler!', 'Premium etkin. Keyfini çıkarın.');
        navigation.goBack();
      }
    } catch (e) {
      console.warn('present paywall error', e);
      setShowMock(true);
    } finally {
      setLoading(false);
    }
  };

  const handleMockPurchase = () => {
    setShowMock(false);
    Alert.alert('Demo', 'Mock satın alma tamamlandı.');
  };

  const handleContinueFree = () => {
    navigation.navigate('DreamInput');
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Unlock Premium Features</Text>
          <Text style={styles.subtitle}>Transform your dreams with advanced AI capabilities</Text>
        </View>

        <View style={styles.demoContainer}>
          <View style={styles.demoBox}>
            <Text style={styles.demoIcon}>✨</Text>
            <Text style={styles.demoTitle}>Premium Animation Preview</Text>
            <Video
              source={require('../../assets/output-4.mp4')}
              style={{ width: '100%', height: 200, borderRadius: 12 }}
              resizeMode="cover"
              isLooping
              shouldPlay
              isMuted
            />
            <Text style={[styles.demoText, { marginTop: 12 }]}>
              Your dream visualization will look like this...
            </Text>
          </View>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Premium Features</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.pricingContainer}>
          <Text style={styles.pricingTitle}>Choose Your Plan</Text>
          {loading && (
            <View style={{ paddingVertical: 8 }}>
              <ActivityIndicator color="#8b5cf6" />
            </View>
          )}

          <TouchableOpacity
            style={[styles.planButton, selectedPlan === 'monthly' && styles.planButtonActive]}
            onPress={() => setSelectedPlan('monthly')}
          >
            <View style={styles.planContent}>
              <Text style={styles.planTitle}>Monthly</Text>
              <Text style={styles.planPrice}>{selectedProduct?.localizedPrice || '$9.99/month'}</Text>
            </View>
            {selectedPlan === 'monthly' && <Text style={styles.planCheck}>✓</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.planButton, selectedPlan === 'yearly' && styles.planButtonActive]}
            onPress={() => setSelectedPlan('yearly')}
          >
            <View style={styles.planContent}>
              <Text style={styles.planTitle}>Yearly</Text>
              <Text style={styles.planPrice}>
                {products.find(p => p.subscriptionPeriod?.unit === 'year')?.localizedPrice || '$59.99/year'}
              </Text>
              <Text style={styles.planSavings}>Save 50%</Text>
            </View>
            {selectedPlan === 'yearly' && <Text style={styles.planCheck}>✓</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.freeButton} onPress={handleContinueFree}>
          <Text style={styles.freeText}>Continue with Free Version</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={styles.subscribeButtonGradient}
          >
            <Text style={styles.subscribeText}>
              Start Premium Trial
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Modal visible={showMock} transparent animationType="fade" onRequestClose={() => setShowMock(false)}>
        <View style={styles.mockBackdrop}>
          <View style={styles.mockCard}>
            <Text style={styles.mockTitle}>Premium (Demo)</Text>
            <Text style={styles.mockDesc}>Bu bir önizleme ekranıdır. Gerçek satın alma yok.</Text>
            <View style={{ height: 12 }} />
            <TouchableOpacity style={styles.mockBtn} onPress={handleMockPurchase}>
              <Text style={styles.mockBtnText}>Mock Purchase</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.mockBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }]} onPress={() => setShowMock(false)}>
              <Text style={styles.mockBtnText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
  header: { alignItems: 'center', paddingVertical: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center' },
  demoContainer: { marginVertical: 20 },
  demoBox: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
  demoIcon: { fontSize: 40, marginBottom: 10 },
  demoTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 10 },
  demoAnimation: { backgroundColor: 'rgba(99, 102, 241, 0.2)', borderRadius: 8, padding: 15, width: '100%' },
  demoText: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 14, textAlign: 'center' },
  featuresContainer: { marginVertical: 20 },
  featuresTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 16 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 12, padding: 16 },
  featureIcon: { fontSize: 24, marginRight: 16 },
  featureContent: { flex: 1 },
  featureTitle: { fontSize: 16, fontWeight: '600', color: 'white', marginBottom: 4 },
  featureDescription: { fontSize: 14, color: 'rgba(255, 255, 255, 0.7)' },
  pricingContainer: { marginVertical: 20 },
  pricingTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 16 },
  planButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 2, borderColor: 'transparent' },
  planButtonActive: { borderColor: '#6366f1', backgroundColor: 'rgba(99, 102, 241, 0.1)' },
  planContent: { flex: 1 },
  planTitle: { fontSize: 18, fontWeight: '600', color: 'white', marginBottom: 4 },
  planPrice: { fontSize: 16, color: '#6366f1', fontWeight: 'bold' },
  planSavings: { fontSize: 12, color: '#10b981', marginTop: 2 },
  planCheck: { fontSize: 20, color: '#6366f1', fontWeight: 'bold' },
  bottomContainer: { paddingHorizontal: 20, paddingVertical: 20, paddingBottom: 40 },
  freeButton: { paddingVertical: 12, alignItems: 'center', marginBottom: 12 },
  freeText: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 16 },
  subscribeButton: { borderRadius: 25, overflow: 'hidden' },
  subscribeButtonGradient: { paddingVertical: 16, alignItems: 'center' },
  subscribeText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  mockBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  mockCard: { backgroundColor: '#1f2242', borderRadius: 16, padding: 20, width: '100%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  mockTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  mockDesc: { color: 'rgba(255,255,255,0.8)', marginTop: 8 },
  mockBtn: { marginTop: 14, backgroundColor: '#6366f1', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  mockBtnText: { color: 'white', fontWeight: 'bold' },
});

export default PaywallScreen;
