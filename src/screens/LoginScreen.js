import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

// Firebase servis importu
import { login } from "../services/authService";

export default function LoginScreen({ navigation }) {
    // 🔑 username değil email kullanalım
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

  
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Hata", "Lütfen email ve şifre girin");
            return;
        }

        try {
            const user = await login(email, password);
            Alert.alert("Başarılı", `Hoş geldin ${user.email}`);
            navigation.replace("MainTabs");
        } catch (error) {
            let message = "Bir hata oluştu, tekrar deneyin.";

            if (error.code === "auth/invalid-email") {
                message = "Geçersiz email formatı.";
            } else if (error.code === "auth/user-not-found") {
                message = "Kullanıcı bulunamadı.";
            } else if (error.code === "auth/wrong-password") {
                message = "Şifre yanlış.";
            } else if (error.code === "auth/too-many-requests") {
                message = "Çok fazla deneme yaptınız. Lütfen sonra tekrar deneyin.";
            }

            // ✅ Kullanıcıya ekranda Alert göster
            Alert.alert("Giriş Hatası", message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Dream Visualizer</Text>
                <Text style={styles.subtitle}>
                    Log in to your AI-powered dream interpreter
                </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    placeholderTextColor="#aaa"
                    style={styles.input}
                    autoCapitalize="none"
                />
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    style={styles.input}
                />

                <TouchableOpacity onPress={handleLogin}>
                    <LinearGradient
                        colors={["#5211d4", "#764ba2"]}
                        style={styles.loginButton}
                    >
                        <Text style={styles.loginText}>Log In</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text style={styles.forgot}>Forgot Password?</Text>
                </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>Or continue with</Text>
                <View style={styles.line} />
            </View>

            {/* Social Login */}
            <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                    <MaterialIcons name="google" size={20} color="#4285F4" />
                    <Text style={styles.socialText}>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                    <MaterialIcons name="mail" size={20} color="#720e9e" />
                    <Text style={styles.socialText}>Yahoo</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161022", // dark theme
        padding: 20,
        justifyContent: "center",
    },
    header: {
        alignItems: "center",
        marginBottom: 40,
    },
    title: {
        fontSize: 34,
        fontWeight: "bold",
        color: "#fff",
    },
    subtitle: {
        fontSize: 14,
        color: "#aaa",
        marginTop: 8,
        textAlign: "center",
    },
    form: {
        marginBottom: 20,
    },
    input: {
        backgroundColor: "#1e1b2e",
        color: "#fff",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#333",
    },
    loginButton: {
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
        marginBottom: 10,
    },
    loginText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    forgot: {
        color: "#764ba2",
        textAlign: "center",
        marginTop: 5,
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#333",
    },
    dividerText: {
        color: "#aaa",
        marginHorizontal: 10,
        fontSize: 12,
    },
    socialContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },
    socialButton: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#1e1b2e",
        paddingVertical: 12,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#333",
        marginHorizontal: 5,
    },
    socialText: {
        color: "#fff",
        marginLeft: 8,
        fontSize: 14,
    },
});
