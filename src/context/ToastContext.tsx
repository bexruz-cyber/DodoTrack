"use client"

import type React from "react"
import { createContext, useState, useContext, useRef, useEffect } from "react"
import { Animated, StyleSheet, Text } from "react-native"
import type { ToastProps } from "../types"

interface ToastContextType {
  showToast: (toast: ToastProps) => void
  hideToast: () => void
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
  hideToast: () => {},
})

export const useToast = () => useContext(ToastContext)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastProps | null>(null)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const showToast = (newToast: ToastProps) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setToast(newToast)
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()

    timeoutRef.current = setTimeout(() => {
      hideToast()
    }, newToast.duration || 3000)
  }

  const hideToast = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setToast(null)
    })
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const getBackgroundColor = () => {
    if (!toast) return "#333"

    switch (toast.type) {
      case "success":
        return "#4CAF50"
      case "warning":
        return "#FF9800"
      case "error":
        return "#F44336"
      case "info":
      default:
        return "#2196F3"
    }
  }

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              backgroundColor: getBackgroundColor(),
            },
          ]}
        >
          <Text style={styles.text}>{toast.message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
})
