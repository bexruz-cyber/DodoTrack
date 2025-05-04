"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { User } from "../types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

// Mock users for demo
const mockUsers: User[] = [
  {
    id: "1",
    fullName: "Admin Adminov",
    username: "admin",
    password: "admin123",
    department: "Boshqaruv",
    role: "admin",
  },
  {
    id: "2",
    fullName: "Foydalanuvchi Foydalanuvchiyev",
    username: "user",
    password: "user123",
    department: "Tikuv",
    role: "user",
  },
  {
    id: "3",
    fullName: "Ombor Omborchiyev",
    username: "ombor",
    password: "ombor123",
    department: "Ombor",
    role: "user",
  },
]

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const loadUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem("user")
        if (userJson) {
          setUser(JSON.parse(userJson))
        }
      } catch (error) {
        console.error("Failed to load user from storage", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Find user with matching credentials
      const foundUser = mockUsers.find((u) => u.username === username && u.password === password)

      if (foundUser) {
        setUser(foundUser)
        await AsyncStorage.setItem("user", JSON.stringify(foundUser))
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
      await AsyncStorage.removeItem("user")
      setUser(null)
    } catch (error) {
      console.error("Logout error", error)
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}
