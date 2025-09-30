import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

// Firebase servis importu
import { register } from "../services/authService"; 

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert("Hata", "Lütfen tüm alanları doldurun");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Hata", "Şifreler uyuşmuyor");
            return;
        }

        try {
            const user = await register(email, password);
            Alert.alert("Kayıt Başarılı", `Hoş geldin ${user.email}`);
            // Başarılıysa ana sayfaya yönlendir
            navigation.replace("MainTabs");
        } catch (error) {
            console.log(error);
            Alert.alert("Kayıt Hatası", error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>
                        Join us to explore your dreams with AI.
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <TextInput
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Username"
                        placeholderTextColor="#aaa"
                        style={styles.input}
                    />
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        placeholderTextColor="#aaa"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                    />
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        placeholderTextColor="#aaa"
                        secureTextEntry
                        style={styles.input}
                    />
                    <TextInput
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm Password"
                        placeholderTextColor="#aaa"
                        secureTextEntry
                        style={styles.input}
                    />

                    {/* Register Button */}
                    <TouchableOpacity onPress={handleRegister}>
                        <LinearGradient
                            colors={["#5211d4", "#764ba2"]}
                            style={styles.registerButton}
                        >
                            <Text style={styles.registerText}>Sign Up</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                    <View style={styles.line} />
                    <Text style={styles.dividerText}>Or sign up with</Text>
                    <View style={styles.line} />
                </View>

                {/* Social Buttons */}
                <View style={styles.socialContainer}>
                    <TouchableOpacity style={styles.socialButton}>
                        <MaterialIcons name="google" size={22} color="#4285F4" />
                        <Text style={styles.socialText}>Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                        <MaterialIcons name="mail" size={22} color="#720e9e" />
                        <Text style={styles.socialText}>Yahoo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                        <MaterialIcons name="facebook" size={22} color="#1877F2" />
                        <Text style={styles.socialText}>Facebook</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <Text style={styles.footerText}>
                    Already have an account?{" "}
                    <Text
                        style={styles.footerLink}
                        onPress={() => navigation.navigate("Login")}
                    >
                        Log In
                    </Text>
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161022",
        padding: 20,
    },
    header: {
        alignItems: "center",
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
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
    registerButton: {
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 10,
    },
    registerText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
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
        marginBottom: 30,
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
    footerText: {
        color: "#aaa",
        textAlign: "center",
        fontSize: 13,
    },
    footerLink: {
        color: "#764ba2",
        fontWeight: "600",
    },
});
