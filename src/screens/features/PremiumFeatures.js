import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PremiumFeatures = ({ aiComment }) => {
  return (
    <>
      {/* Video Alanı (şimdilik placeholder) */}
      <View style={styles.videoContainer}>
        <Text style={styles.videoText}>🎬 Video Alanı (AI Generated)</Text>
      </View>

      {/* Uzun Yorum */}
      <View style={styles.commentContainer}>
        <Text style={styles.commentLabel}>AI Dream Analysis</Text>
        <Text style={styles.commentText}>
          {aiComment || "Premium uzun yorum burada görünecek..."}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    height: 300,
    backgroundColor: "#111",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  videoText: { color: "white" },
  commentContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16, padding: 20, marginBottom: 20,
    borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.2)",
  },
  commentLabel: { fontSize: 16, fontWeight: "bold", color: "white", marginBottom: 12 },
  commentText: { fontSize: 14, color: "rgba(255,255,255,0.9)", lineHeight: 20 },
});

export default PremiumFeatures;
