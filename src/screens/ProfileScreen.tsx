import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  StatusBar,
  Image,
  Dimensions,
  Platform
} from "react-native"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { LogOut, User, Briefcase, Mail, Calendar, Shield, Activity, Package, Clock, CheckCircle } from "react-native-feather"
import LinearGradient from "react-native-linear-gradient"

const { width } = Dimensions.get("window")

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

  // Get first letter of name for avatar placeholder
  const getInitials = () => {
    if (!user?.fullName) return "U";
    return user.fullName.charAt(0).toUpperCase();
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#ffffff"]}
            tintColor="#ffffff"
            progressBackgroundColor="#5e72e4"
          />
        }
      >
        <LinearGradient
          colors={['#5e72e4', '#324cdd']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.profileImageContainer}>
              <Text style={styles.initialsText}>{getInitials()}</Text>
            </View>
            <Text style={styles.name}>{user?.fullName}</Text>
            <Text style={styles.department}>{user?.department} bo'limi</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <LogOut width={20} height={20} color="white" />
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.contentContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Shaxsiy ma'lumotlar</Text>

            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <User width={18} height={18} color="#5e72e4" />
              </View>
              <Text style={styles.infoLabel}>Foydalanuvchi nomi</Text>
              <Text style={styles.infoValue}>{user?.username}</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Briefcase width={18} height={18} color="#5e72e4" />
              </View>
              <Text style={styles.infoLabel}>Lavozim</Text>
              <Text style={styles.infoValue}>{user?.role === "admin" ? "Administrator" : "Xodim"}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Statistika</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: 'rgba(94, 114, 228, 0.1)' }]}>
                <Package width={20} height={20} color="#5e72e4" />
              </View>
              <Text style={styles.statValue}>{statistics.sent}</Text>
              <Text style={styles.statLabel}>Yuborilgan</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: 'rgba(45, 206, 137, 0.1)' }]}>
                <Activity width={20} height={20} color="#2dce89" />
              </View>
              <Text style={[styles.statValue, { color: '#2dce89' }]}>{statistics.received}</Text>
              <Text style={styles.statLabel}>Qabul qilingan</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: 'rgba(251, 99, 64, 0.1)' }]}>
                <Clock width={20} height={20} color="#fb6340" />
              </View>
              <Text style={[styles.statValue, { color: '#fb6340' }]}>{statistics.pending}</Text>
              <Text style={styles.statLabel}>Kutilmoqda</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: 'rgba(17, 205, 239, 0.1)' }]}>
                <CheckCircle width={20} height={20} color="#11cdef" />
              </View>
              <Text style={[styles.statValue, { color: '#11cdef' }]}>{statistics.completed}</Text>
              <Text style={styles.statLabel}>Yakunlangan</Text>
            </View>
          </View>

       
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fe",
    paddingBottom: 50
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 60 : 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  profileImage: {
    width: 94,
    height: 94,
    borderRadius: 47,
  },
  initialsText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#5e72e4",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  department: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  contentContainer: {
    padding: 16,
    marginTop: -20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#32325d",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f7fafc",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(94, 114, 228, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 15,
    color: "#8898aa",
    flex: 1,
  },
  infoValue: {
    fontSize: 15,
    color: "#32325d",
    fontWeight: "600",
    textAlign: "right",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#32325d",
    marginBottom: 16,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    width: width / 2 - 24,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5e72e4",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#8898aa",
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 30,
    position: "absolute",
    right: 20,
    top: 20
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
})

export default ProfileScreen