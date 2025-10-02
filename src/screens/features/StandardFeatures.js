import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

const StandardFeatures = ({ generatedImage, aiComment }) => {
  return (
    <>
      {/* Görsel */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: generatedImage }} style={styles.generatedImage} />
        <View style={styles.imageOverlay}>
          <Text style={styles.imageLabel}>AI Generated Visualization</Text>
        </View>
      </View>

      {/* Kısa Yorum */}
      <View style={styles.commentContainer}>
        <Text style={styles.commentLabel}>AI Dream Analysis</Text>
        <Text style={styles.commentText}>
          {aiComment || "Standart kısa yorum burada görünecek..."}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  imageContainer: { alignItems: "center", marginBottom: 20 },
  generatedImage: { width: "100%", height: 300, borderRadius: 16, resizeMode: "cover" },
  imageOverlay: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)", padding: 12,
    borderBottomLeftRadius: 16, borderBottomRightRadius: 16,
  },
  imageLabel: { color: "white", textAlign: "center" },
  commentContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16, padding: 20, marginBottom: 20,
    borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.2)",
  },
  commentLabel: { fontSize: 16, fontWeight: "bold", color: "white", marginBottom: 12 },
  commentText: { fontSize: 14, color: "rgba(255,255,255,0.9)", lineHeight: 20 },
});

export default StandardFeatures;
