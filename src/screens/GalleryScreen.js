import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  FlatList,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { Heart, Search, Filter, Grid, List } from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";

const { width } = Dimensions.get("window");
const itemWidth = (width - 60) / 2;

const mockDreams = [
  {
    id: "1",
    title: "Flying Through Clouds",
    description: "Soaring through fluffy white clouds in a starlit sky",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    date: "2024-01-15",
    isFavorite: true,
  },
  {
    id: "2",
    title: "Mystical Forest",
    description: "Walking through an enchanted forest with glowing trees",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop",
    date: "2024-01-14",
    isFavorite: false,
  },
  // Diğer mock veriler
];

export default function GalleryScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [viewMode, setViewMode] = useState("grid");
  const [filter, setFilter] = useState("all");
  const [dreams, setDreams] = useState(mockDreams);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) return null;

  const filteredDreams = dreams.filter(d => filter === "favorites" ? d.isFavorite : true);

  const toggleFavorite = (id) => {
    setDreams(prev => prev.map(d => d.id === id ? { ...d, isFavorite: !d.isFavorite } : d));
  };

  const renderItem = ({ item }) => {
    const containerStyle = {
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.9)",
      borderRadius: 16,
      marginBottom: 16,
      padding: viewMode === "grid" ? 12 : 16,
      borderWidth: 1,
      borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(102,126,234,0.2)",
      flexDirection: viewMode === "list" ? "row" : "column",
      alignItems: viewMode === "list" ? "center" : "flex-start",
      width: viewMode === "grid" ? itemWidth : "100%",
    };

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Visualization', {
            dreamText: item.description,
            style: 'realistic',
            timestamp: new Date().toISOString(),
          })
        }
        style={containerStyle}
      >
        <View style={{ position: "relative", marginRight: viewMode === "list" ? 16 : 0 }}>
          <Image
            source={{ uri: item.image }}
            style={{
              width: viewMode === "list" ? 80 : "100%",
              height: viewMode === "list" ? 80 : itemWidth - 24,
              borderRadius: 12,
              marginBottom: viewMode === "list" ? 0 : 12,
              resizeMode: "cover",
            }}
          />
          <TouchableOpacity
            onPress={() => toggleFavorite(item.id)}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "rgba(0,0,0,0.6)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Heart
              size={16}
              color={item.isFavorite ? "#f87171" : "#fff"}
              fill={item.isFavorite ? "#f87171" : "transparent"}
            />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, marginTop: viewMode === "list" ? 0 : 8 }}>
          <Text
            style={{
              fontSize: viewMode === "list" ? 16 : 14,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#fff" : "#333",
              marginBottom: 4,
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: viewMode === "list" ? 14 : 12,
              fontFamily: "Inter_400Regular",
              color: isDark ? "rgba(255,255,255,0.7)" : "#666",
              lineHeight: 18,
            }}
            numberOfLines={viewMode === "list" ? 2 : 2}
          >
            {item.description}
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Inter_400Regular",
              color: isDark ? "rgba(255,255,255,0.5)" : "#999",
              marginTop: 4,
            }}
          >
            {new Date(item.date).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f3460"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >

      <StatusBar style="light" />
      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 16 }}>
        <Text style={{ fontSize: 28, fontFamily: "Inter_600SemiBold", color: "#fff", marginBottom: 16 }}>
          Dream Gallery
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.3)",
            }}
          >
            <Search size={20} color="rgba(255,255,255,0.7)" />
            <Text style={{ marginLeft: 8, fontSize: 16, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)" }}>
              Search dreams...
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: "rgba(255,255,255,0.2)",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.3)",
            }}
          >
            {viewMode === "grid" ? <List size={20} color="#fff" /> : <Grid size={20} color="#fff" />}
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 4 }}>
          {[
            { key: "all", label: "All Dreams" },
            { key: "favorites", label: "Favorites" },
          ].map(option => (
            <TouchableOpacity
              key={option.key}
              onPress={() => setFilter(option.key)}
              style={{
                backgroundColor: filter === option.key ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)",
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginRight: 12,
                borderWidth: 1,
                borderColor: filter === option.key ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)",
              }}
            >
              <Text style={{ fontSize: 14, fontFamily: "Inter_500Medium", color: "#fff" }}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredDreams.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40 }}>
          <Heart size={48} color="rgba(255,255,255,0.6)" />
          <Text style={{ fontSize: 20, fontFamily: "Inter_600SemiBold", color: "#fff", textAlign: "center", marginTop: 16, marginBottom: 8 }}>
            No Dreams Found
          </Text>
          <Text style={{ fontSize: 16, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.8)", textAlign: "center", lineHeight: 24 }}>
            {filter === "favorites" ? "You haven't favorited any dreams yet" : "Start creating dream visualizations to build your gallery"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredDreams}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 20 }}
          numColumns={viewMode === "grid" ? 2 : 1}
          columnWrapperStyle={viewMode === "grid" ? { justifyContent: "space-between" } : null}
          showsVerticalScrollIndicator={false}
        />
      )}
    </LinearGradient>
  );
}