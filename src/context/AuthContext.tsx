import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { User } from "../types"
import { axiosInstance } from "../api/axios"
import axios from "axios"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string, isAdmin: boolean) => Promise<boolean>
  loadUser: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  loadUser: async () => { },
  logout: () => { },
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem("user")
      const token = await AsyncStorage.getItem("token")

      if (userJson && token) {
        setUser(JSON.parse(userJson))
      }
    } catch (error) {
      console.error("Failed to load user from storage", error)
      await AsyncStorage.removeItem("user")
      await AsyncStorage.removeItem("token")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  const login = async (username: string, password: string, isAdmin: boolean): Promise<boolean> => {
    try {
      const endpoint = isAdmin ? "/api/auth/admin/login" : "/api/auth/employee/login"
      const response = await axios.post(`https://dodo-kids-back-end.onrender.com${endpoint}`, {
        login: username,
        password: password,
      })

      console.log(response.data);


      if (response.data) {
        const { token } = response.data
        await AsyncStorage.setItem("token", token)

        let userData: User

        if (isAdmin) {
          const { admin } = response.data
          userData = {
            id: admin.id,
            fullName: admin.fullName || admin.login,
            username: admin.login,
            department: {
              createdAt: "",
              updatedAt: "",
              id: "Boshqaruv",
              name: "Boshqaruv"
            },
            password: "",
            role: "admin",
          }
        } else {
          const { employee } = response.data

          userData = {
            id: employee.id,
            fullName: employee.login,
            username: employee.login,
            department: {
              createdAt: employee.type.createdAt,
              updatedAt: employee.type.updatedAt,
              id: employee.type.id,
              name: employee.type.name
            },
            password: "",
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
      delete axiosInstance.defaults.headers.common["Authorization"]
      await AsyncStorage.removeItem("token")
      await AsyncStorage.removeItem("user")
      setUser(null)
    } catch (error) {
      console.error("Logout error", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  )
}
