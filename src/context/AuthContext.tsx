import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { User } from "../types"
import { axiosInstance } from "../api/axios"
import axios from "axios"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string, isAdmin: boolean) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const loadUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem("user")
        const token = await AsyncStorage.getItem("token")
        
        if (userJson && token) {
          setUser(JSON.parse(userJson))
        }
      } catch (error) {
        console.error("Failed to load user from storage", error)
        // Clear potentially corrupted data
        await AsyncStorage.removeItem("user")
        await AsyncStorage.removeItem("token")
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (username: string, password: string, isAdmin: boolean): Promise<boolean> => {
    try {
      const endpoint = isAdmin ? "/api/auth/admin/login" : "/api/auth/employee/login"
      
      const response = await axios.post(`https://dodo-kids-back-end.onrender.com${endpoint}`, {
        login: username,
        password: password,
      })

      if (response.data) {
        const { token } = response.data
        
        // Set the token in axios headers for subsequent requests
        await AsyncStorage.setItem("token", token)
        
        let userData: User
        
        if (isAdmin) {
          const { admin } = response.data
          userData = {
            id: admin.id,
            fullName: admin.fullName || admin.login,
            username: admin.login,
            department: "Boshqaruv",
            password: "", // Don't store password in memory
            role: "admin",
          }
        } else {
          const { employee } = response.data
          userData = {
            id: employee.id,
            fullName: employee.fullName || employee.login,
            username: employee.login,
            department: employee.type || "Bo'lim",
            password: "", // Don't store password in memory
            role: "user",
          }
        }
        
        setUser(userData)
        await AsyncStorage.setItem("user", JSON.stringify(userData))
        return true
      }
      
      return false
    } catch (error) {
      console.error("Login error", error)
      return false
    }
  }

  const logout = async () => {
    try {
      // Remove token from axios headers
      delete axiosInstance.defaults.headers.common["Authorization"]
      
      // Clear storage
      await AsyncStorage.removeItem("token")
      await AsyncStorage.removeItem("user")
      
      // Update state
      setUser(null)
    } catch (error) {
      console.error("Logout error", error)
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}