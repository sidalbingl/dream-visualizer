import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  FlatList,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Heart, Search, Filter, Grid, List, Trash2 } from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import {
  onSnapshot,
  collection,
  orderBy,
  query,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const { width } = Dimensions.get("window");
const itemWidth = (width - 60) / 2;

export default function GalleryScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [viewMode, setViewMode] = useState("grid");
  const [filter, setFilter] = useState("all");
  const [dreams, setDreams] = useState([]);
  const [longPressedItem, setLongPressedItem] = useState(null);
  const isFocused = useIsFocused();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "dreams"),
      orderBy("date", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setDreams(items);
      },
      (err) => {
        console.error("dreams snapshot error", err);
        Alert.alert("Error", "Failed to load dreams");
      }
    );

    return () => unsub();
  }, [isFocused]);

  if (!fontsLoaded) return null;

  const filteredDreams = dreams.filter((d) =>
    filter === "favorites" ? d.isFavorite : true
  );

  const toggleFavorite = async (id, currentValue) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      await updateDoc(doc(db, "users", user.uid, "dreams", id), {
        isFavorite: !currentValue,
      });
    } catch (err) {
      console.error("toggleFavorite error:", err);
      Alert.alert("Error", "Failed to update favorite");
    }
  };

  const deleteDream = async (id, dreamTitle) => {
    Alert.alert(
      "🗑️ Delete Dream",
      `Are you sure you want to delete "${dreamTitle}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setLongPressedItem(null)
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (!user) return;
              await deleteDoc(doc(db, "users", user.uid, "dreams", id));
              setLongPressedItem(null);
            } catch (err) {
              console.error("deleteDream error:", err);
              Alert.alert("Error", "Failed to delete dream");
              setLongPressedItem(null);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => {
    const isPressed = longPressedItem === item.id;
    
    const containerStyle = {
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.9)",
      borderRadius: 16,
      marginBottom: 16,
      padding: viewMode === "grid" ? 12 : 16,
      borderWidth: isPressed ? 2 : 1,
      borderColor: isPressed ? "#ef4444" : (isDark ? "rgba(255,255,255,0.2)" : "rgba(102,126,234,0.2)"),
      flexDirection: viewMode === "list" ? "row" : "column",
      alignItems: viewMode === "list" ? "center" : "flex-start",
      width: viewMode === "grid" ? itemWidth : "100%",
    };

    return (
      <TouchableOpacity
        onPress={() => {
          if (isPressed) {
            // Eğer delete mode'daysa, tıklama ile iptal et
            setLongPressedItem(null);
          } else {
            // Normal tıklama - detay sayfasına git
            navigation.navigate('FavoriteDetail', { item });
          }
        }}
        onLongPress={() => {
          setLongPressedItem(item.id);
        }}
        style={containerStyle}
        activeOpacity={0.7}
      >
        <View
          style={{
            position: "relative",
            marginRight: viewMode === "list" ? 16 : 0,
          }}
        >
          {(item.mediaUrl || item.posterUrl) ? (
            <Image
              source={{ uri: item.mediaUrl || item.posterUrl }}
              style={{
                width: viewMode === "list" ? 80 : "100%",
                height: viewMode === "list" ? 80 : itemWidth - 24,
                borderRadius: 12,
                marginBottom: viewMode === "list" ? 0 : 12,
                resizeMode: "cover",
              }}
              onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
            />
          ) : (
            <View
              style={{
                width: viewMode === "list" ? 80 : "100%",
                height: viewMode === "list" ? 80 : itemWidth - 24,
                borderRadius: 12,
                marginBottom: viewMode === "list" ? 0 : 12,
                backgroundColor: "rgba(99, 102, 241, 0.2)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                No Image
              </Text>
            </View>
          )}
          
          {/* Heart Button */}
          {!isPressed && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                toggleFavorite(item.id, item.isFavorite);
              }}
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
          )}

          {/* ✅ Delete Button (sadece long press yapılınca görünür) */}
          {isPressed && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                deleteDream(item.id, item.titleDate || "Unnamed Dream");
              }}
              style={{
                position: "absolute",
                top: -8,
                left: -8,
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "#ef4444",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
                zIndex: 10,
              }}
            >
              <Trash2 size={18} color="#fff" />
            </TouchableOpacity>
          )}
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
            {item.titleDate || "Unnamed Dream"}
          </Text>
          <Text
            style={{
              fontSize: viewMode === "list" ? 14 : 12,
              fontFamily: "Inter_400Regular",
              color: isDark ? "rgba(255,255,255,0.7)" : "#666",
              lineHeight: 18,
            }}
            numberOfLines={2}
          >
            {item.summary || item.dreamText}
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Inter_400Regular",
              color: isDark ? "rgba(255,255,255,0.5)" : "#999",
              marginTop: 4,
            }}
          >
            {item.date?.toDate
              ? item.date.toDate().toLocaleDateString()
              : ""}
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
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontFamily: "Inter_600SemiBold",
            color: "#fff",
            marginBottom: 16,
          }}
        >
          Dream Gallery
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
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
            <Text
              style={{
                marginLeft: 8,
                fontSize: 16,
                fontFamily: "Inter_400Regular",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              Search dreams...
            </Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              setViewMode(viewMode === "grid" ? "list" : "grid")
            }
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
            {viewMode === "grid" ? (
              <List size={20} color="#fff" />
            ) : (
              <Grid size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 4 }}
        >
          {[
            { key: "all", label: "All Dreams" },
            { key: "favorites", label: "Favorites" },
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              onPress={() => setFilter(option.key)}
              style={{
                backgroundColor:
                  filter === option.key
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(255,255,255,0.1)",
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginRight: 12,
                borderWidth: 1,
                borderColor:
                  filter === option.key
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(255,255,255,0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter_500Medium",
                  color: "#fff",
                }}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredDreams.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 40,
          }}
        >
          <Heart size={48} color="rgba(255,255,255,0.6)" />
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Inter_600SemiBold",
              color: "#fff",
              textAlign: "center",
              marginTop: 16,
              marginBottom: 8,
            }}
          >
            No Dreams Found
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_400Regular",
              color: "rgba(255,255,255,0.8)",
              textAlign: "center",
              lineHeight: 24,
            }}
          >
            {filter === "favorites"
              ? "You haven't favorited any dreams yet"
              : "Start creating dream visualizations to build your gallery"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredDreams}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 20,
          }}
          numColumns={viewMode === "grid" ? 2 : 1}
          columnWrapperStyle={
            viewMode === "grid" ? { justifyContent: "space-between" } : null
          }
          key={viewMode} // ✅ Force re-render on view mode change
          showsVerticalScrollIndicator={false}
        />
      )}
    </LinearGradient>
  );
}