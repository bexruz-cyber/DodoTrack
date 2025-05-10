import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { User } from "../types"
import { axiosInstance } from "../api/axios"
import axios from "axios"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
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

      // const { data } = await axios.post(`https://dodo-kids-back-end.onrender.com/${token}`)

      // console.log(data);

      if (userJson && token) {
        setUser(JSON.parse(userJson))
      }
    } catch (error) {
      console.error("Midleware error", error)
      await AsyncStorage.removeItem("user")
      await AsyncStorage.removeItem("token")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const { data } = await axios.post(`https://dodo-kids-back-end.onrender.com/api/auth/login`, {
        login: username,
        password: password,
      })

      console.log("Loginn data", data)

      if (data) {
        const { token } = data
        await AsyncStorage.setItem("token", token)

        let userData: User

        userData = {
          id: data.employee.id,
          username: data.login,
          role: data.role,
          employee: {
            id: data.employee.id,
            userId: data.employee.userId,
            name: data.role === "ADMIN" ? "Boshqaruv" : data.role,
            departmentId: data.departmentId,
            createdAt: data.employee.id,
            updatedAt: data.employee.id,
          },
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
