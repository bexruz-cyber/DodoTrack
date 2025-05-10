import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const baseURL = "https://dodo-kids-back-end.onrender.com" // Replace with your actual API base URL

export const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor for authentication
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle global errors here
    if (error.response && error.response.status === 401) {
      // You might want to redirect to login screen
    }
    return Promise.reject(error)
  }
)
