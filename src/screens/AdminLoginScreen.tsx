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
import { useNavigation } from "@react-navigation/native"
import { Eye, EyeOff, ArrowLeft } from "react-native-feather"
import { useToast } from "../context/ToastContext"
import { RootStackNavigationProp } from "../navigation/types"
import { useAuth } from "../context/AuthContext"

const AdminLoginScreen = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { showToast } = useToast()
  const { login } = useAuth()
  const navigation = useNavigation<RootStackNavigationProp>()

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
      const success = await login(username, password, true) // true for admin login
      if (!success) {
        showToast({
          type: "error",
          message: "Login yoki parol noto'g'ri",
        })
      } else {
        showToast({
          type: "success",
          message: "Muvaffaqiyatli kirildi",
        })
        // No need to navigate manually - AppNavigator will handle it
      }
    } catch (error) {
      console.error("Login error", error)
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

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <ArrowLeft width={24} height={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/2271/2271113.png" }} style={styles.logo} />
        <Text style={styles.title}>Admin kirish</Text>
        <Text style={styles.subtitle}>Tizimni boshqarish uchun admin hisobingizga kiring</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Admin loginingizni kiriting"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Parol</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Parolingizni kiriting"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOff width={20} height={20} color="#95a5a6" />
            ) : (
              <Eye width={20} height={20} color="#95a5a6" />
            )}
          </TouchableOpacity>
        </View>

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
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 80,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
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
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 15,
  },
  loginButton: {
    backgroundColor: "#3498db",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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

export default AdminLoginScreen
