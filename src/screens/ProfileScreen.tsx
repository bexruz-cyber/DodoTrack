"use client"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, RefreshControl } from "react-native"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { LogOut, User, Mail, Briefcase } from "react-native-feather"

const ProfileScreen = () => {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const [refreshing, setRefreshing] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      showToast({
        type: "success",
        message: "Muvaffaqiyatli chiqish",
      })
    } catch (error) {
      showToast({
        type: "error",
        message: "Xatolik yuz berdi",
      })
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    // Simulate data fetching
    setTimeout(() => {
      setRefreshing(false)
      showToast({
        type: "success",
        message: "Ma'lumotlar yangilandi",
      })
    }, 1500)
  }

  // Mock statistics
  const statistics = {
    sent: 45,
    received: 38,
    pending: 7,
    completed: 32,
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#3498db"]} />}
    >
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.profileImage} />
        </View>
        <Text style={styles.name}>{user?.fullName}</Text>
        <Text style={styles.department}>{user?.department} bo'limi</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <User width={20} height={20} color="#3498db" />
          <Text style={styles.infoLabel}>Foydalanuvchi nomi:</Text>
          <Text style={styles.infoValue}>{user?.username}</Text>
        </View>
        <View style={styles.infoRow}>
          <Briefcase width={20} height={20} color="#3498db" />
          <Text style={styles.infoLabel}>Lavozim:</Text>
          <Text style={styles.infoValue}>{user?.role === "admin" ? "Administrator" : "Xodim"}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Statistika</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{statistics.sent}</Text>
            <Text style={styles.statLabel}>Yuborilgan</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{statistics.received}</Text>
            <Text style={styles.statLabel}>Qabul qilingan</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{statistics.pending}</Text>
            <Text style={styles.statLabel}>Kutilmoqda</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{statistics.completed}</Text>
            <Text style={styles.statLabel}>Yakunlangan</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut width={20} height={20} color="white" />
        <Text style={styles.logoutButtonText}>Chiqish</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#3498db",
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: "center",
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  department: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
    marginLeft: 12,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  statsContainer: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    margin: 16,
    borderRadius: 8,
    marginBottom: 30,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
})

export default ProfileScreen
