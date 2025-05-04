"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from "react-native"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"

const LoginScreen = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { showToast } = useToast()

  const handleLogin = async () => {
    if (!username || !password) {
      showToast({
        type: "warning",
        message: "Login va parolni kiriting",
      })
      return
    }

    setIsLoading(true)
    try {
      const success = await login(username, password)
      if (!success) {
        showToast({
          type: "error",
          message: "Login yoki parol noto'g'ri",
        })
      }
    } catch (error) {
      showToast({
        type: "error",
        message: "Xatolik yuz berdi",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.logoContainer}>
        <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.logo} />
        <Text style={styles.title}>Tekstil Boshqaruv Tizimi</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Loginingizni kiriting"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Parol</Text>
        <TextInput
          style={styles.input}
          placeholder="Parolingizni kiriting"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Kirish</Text>}
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>Tekstil ishlab chiqarish boshqaruv tizimi</Text>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "space-between",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  formContainer: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  loginButton: {
    backgroundColor: "#3498db",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerText: {
    textAlign: "center",
    color: "#999",
    marginBottom: 20,
  },
})

export default LoginScreen
