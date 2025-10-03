import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Camera, ChevronLeft } from "lucide-react-native";

export default function EditProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  // Demo state
  const [name, setName] = useState("Dream Explorer");
  const [email] = useState("dreamer@example.com"); // readonly
  const [bio, setBio] = useState("Dream lover ✨");
  const [avatar, setAvatar] = useState(null);

  const handleSave = () => {
    // Burada backend'e kaydetme işlemi yapılabilir
    alert("Profile updated!");
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f1419"]}
      style={{ flex: 1 }}
    >
      <StatusBar style="light" />

      {/* Header */}
      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 16, flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <ChevronLeft size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <View style={styles.container}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatar,
                {
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(255,255,255,0.2)",
                },
              ]}
            >
              <Text style={{ color: "#fff", fontSize: 32 }}>👤</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.changeAvatarButton}
            onPress={() => alert("Change avatar pressed")}
          >
            <Camera size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Name */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Email */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, { color: "rgba(255,255,255,0.6)" }]}
            value={email}
            editable={false}
          />
        </View>

        {/* Bio */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: "top" }]}
            placeholder="Write something about yourself..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={bio}
            onChangeText={setBio}
            multiline
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <LinearGradient
            colors={["#6366f1", "#8b5cf6"]}
            style={styles.saveButtonGradient}
          >
            <Text style={styles.saveText}>Save Changes</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  avatarContainer: {
    alignSelf: "center",
    marginBottom: 30,
    position: "relative",
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  changeAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#8b5cf6",
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: "#1a1a2e",
  },
  inputCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  label: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 6,
  },
  input: {
    fontSize: 16,
    color: "#fff",
  },
  saveButton: {
    marginTop: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  saveText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});
