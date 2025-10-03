import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Video } from 'expo-av';

const FavoriteDetailScreen = ({ navigation, route }) => {
  const { item } = route.params || {};
  const isVideo = item?.mediaType === 'video';

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{item?.titleDate || 'Favorite Detail'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {item?.mediaUrl ? (
          <View style={styles.mediaContainer}>
            {isVideo ? (
              <Video
                source={{ uri: item.mediaUrl }}
                style={styles.media}
                useNativeControls
                resizeMode="contain"
              />
            ) : (
              <Image source={{ uri: item.mediaUrl }} style={styles.media} />
            )}
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.label}>Dream Text</Text>
          <Text style={styles.text}>{item?.dreamText}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>AI Comment</Text>
          <Text style={styles.text}>{item?.aiComment}</Text>
        </View>
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
  content: { flex: 1, paddingHorizontal: 20 },
  mediaContainer: { alignItems: 'center', marginBottom: 20 },
  media: { width: '100%', height: 300, borderRadius: 16 },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  label: { fontSize: 14, color: 'rgba(255, 255, 255, 0.7)', marginBottom: 8 },
  text: { fontSize: 14, color: 'white', lineHeight: 22 },
});

export default FavoriteDetailScreen;


