import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id) => {
    try {
      const updatedFavorites = favorites.filter(fav => fav.id !== id);
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      Alert.alert('Removed', 'Dream removed from favorites');
    } catch (error) {
      Alert.alert('Error', 'Failed to remove favorite');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStyleIcon = (styleName) => {
    const styleIcons = {
      realistic: '🎭',
      anime: '🎌',
      painterly: '🎨',
      surreal: '🌌',
      minimalist: '⚪'
    };
    return styleIcons[styleName] || '🎨';
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity
      style={styles.favoriteItem}
      onPress={() => navigation.navigate('Visualization', {
        dreamText: item.dreamText,
        style: item.style,
        timestamp: item.timestamp,
        isFromFavorites: true
      })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.favoriteImage} />
      
      <View style={styles.favoriteContent}>
        <View style={styles.favoriteHeader}>
          <Text style={styles.favoriteDate}>{formatDate(item.createdAt)}</Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFavorite(item.id)}
          >
            <Text style={styles.removeIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.favoriteText} numberOfLines={2}>
          "{item.dreamText}"
        </Text>
        
        <View style={styles.favoriteFooter}>
          <View style={styles.styleInfo}>
            <Text style={styles.styleIcon}>{getStyleIcon(item.style)}</Text>
            <Text style={styles.styleText}>{item.style.charAt(0).toUpperCase() + item.style.slice(1)}</Text>
          </View>
          
          <View style={styles.commentPreview}>
            <Text style={styles.commentIcon}>💭</Text>
            <Text style={styles.commentText} numberOfLines={1}>
              {item.aiComment}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🌟</Text>
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptyText}>
        Start visualizing your dreams and save your favorites here
      </Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('DreamInput')}
      >
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.createButtonGradient}
        >
          <Text style={styles.createButtonText}>Create Your First Dream</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.container}
      >
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your favorites...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        {favorites.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={favorites}
            renderItem={renderFavoriteItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: 'white',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  listContainer: {
    paddingBottom: 20,
  },
  favoriteItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  favoriteImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  favoriteContent: {
    padding: 16,
  },
  favoriteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  favoriteDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  removeButton: {
    padding: 4,
  },
  removeIcon: {
    fontSize: 16,
  },
  favoriteText: {
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  favoriteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  styleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  styleIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  styleText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
  },
  commentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
  },
  commentIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  commentText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  createButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  createButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FavoritesScreen;
