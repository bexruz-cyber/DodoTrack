import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  Image,
  SafeAreaView
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Eye, EyeOff, ArrowLeft, Layers, Lock, User } from "react-native-feather"
import { useToast } from "../../context/ToastContext"
import { RootStackNavigationProp } from "../../navigation/types"
import { useAuth } from "../../context/AuthContext"
import LinearGradient from "react-native-linear-gradient"

const { width } = Dimensions.get("window")

const Login = () => {
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
      const success = await login(username.trim(), password.trim())
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" translucent />
      
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <LinearGradient
          colors={['#f8f9fa', '#f0f2f5']}
          style={styles.background}
        >
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <View style={styles.backButtonCircle}>
              <ArrowLeft width={22} height={22} color="#3498db" />
            </View>
          </TouchableOpacity>

          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Layers width={40} height={40} color="#3498db" />
              </View>
            </View>
            <Text style={styles.title}>Tekstil Boshqaruv</Text>
            <Text style={styles.subtitle}>Tizimni boshqarish uchun hisobingizga kiring</Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Kirish</Text>
              
              <Text style={styles.label}>Login</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <User width={18} height={18} color="#3498db" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Admin loginingizni kiriting"
                  placeholderTextColor="#aaa"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>

              <Text style={styles.label}>Parol</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Lock width={18} height={18} color="#3498db" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Parolingizni kiriting"
                  placeholderTextColor="#aaa"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon} 
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff width={18} height={18} color="#95a5a6" />
                  ) : (
                    <Eye width={18} height={18} color="#95a5a6" />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[
                  styles.loginButton, 
                  isLoading ? styles.loginButtonDisabled : null
                ]} 
                onPress={handleLogin} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginButtonText}>Kirish</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              Tekstil ishlab chiqarish boshqaruv tizimi
            </Text>
            <Text style={styles.versionText}>v1.0.0</Text>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    padding: 24,
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 10 : 50,
    left: 24,
    zIndex: 10,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 60 : 40,
    marginBottom: 30,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    maxWidth: width * 0.8,
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    marginVertical: 20,
  },
  formContainer: {
    width: "100%",
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    marginBottom: 20,
  },
  inputIconContainer: {
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    padding: 12,
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
  loginButtonDisabled: {
    backgroundColor: "#7fbbeb",
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  footerContainer: {
    marginTop: "auto",
    alignItems: "center",
  },
  footerText: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },
  versionText: {
    marginTop: 6,
    textAlign: "center",
    color: "#999",
    fontSize: 12,
  }
})

export default Login