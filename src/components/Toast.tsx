import React, { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated, TouchableOpacity } from "react-native"
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from "react-native-feather"
import type { ToastProps } from "../types"

const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000, onClose }) => {
  const translateY = useRef(new Animated.Value(-100)).current
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()

    const timer = setTimeout(() => {
      hideToast()
    }, duration)

    return () => clearTimeout(timer)
  }, [])

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onClose) onClose()
    })
  }

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return {
          backgroundColor: "#4caf50",
          icon: <CheckCircle stroke="white" width={20} height={20} />,
        }
      case "error":
        return {
          backgroundColor: "#f44336",
          icon: <AlertCircle stroke="white" width={20} height={20} />,
        }
      case "warning":
        return {
          backgroundColor: "#ff9800",
          icon: <AlertTriangle stroke="white" width={20} height={20} />,
        }
      case "info":
      default:
        return {
          backgroundColor: "#2196f3",
          icon: <Info stroke="white" width={20} height={20} />,
        }
    }
  }

  const toastStyles = getToastStyles()

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: toastStyles.backgroundColor, transform: [{ translateY }], opacity }]}
    >
      <View style={styles.iconContainer}>{toastStyles.icon}</View>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity style={styles.closeButton} onPress={hideToast}>
        <X stroke="white" width={16} height={16} />
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1000,
  },
  iconContainer: {
    marginRight: 10,
  },
  message: {
    flex: 1,
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  closeButton: {
    padding: 4,
  },
})

export default Toast
