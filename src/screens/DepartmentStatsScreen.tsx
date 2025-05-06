import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  Platform
} from "react-native"
import { useToast } from "../context/ToastContext"
import { Search, ArrowLeft, Users, Package, Activity } from "react-native-feather"
import { useNavigation } from "@react-navigation/native"
import LinearGradient from "react-native-linear-gradient"

// Mock data for department statistics
const departmentData = [
  { id: "1", name: "Tikuv", sent: 120, received: 110, efficiency: 92 },
  { id: "2", name: "Ombor", sent: 85, received: 80, efficiency: 94 },
  { id: "3", name: "Bichish", sent: 65, received: 60, efficiency: 92 },
  { id: "4", name: "Qadoqlash", sent: 45, received: 40, efficiency: 89 },
  { id: "5", name: "Dizayn", sent: 30, received: 28, efficiency: 93 },
  { id: "6", name: "Nazorat", sent: 55, received: 50, efficiency: 91 },
  { id: "7", name: "Yuvish", sent: 40, received: 38, efficiency: 95 },
  { id: "8", name: "Dazmollash", sent: 70, received: 65, efficiency: 93 },
  { id: "9", name: "Tugmalar", sent: 25, received: 23, efficiency: 92 },
  { id: "10", name: "Choklar", sent: 60, received: 55, efficiency: 92 },
  { id: "11", name: "Kesish", sent: 50, received: 48, efficiency: 96 },
  { id: "12", name: "Yopishtirish", sent: 35, received: 32, efficiency: 91 },
]

const DepartmentStatsScreen = () => {
  const navigation = useNavigation()
  const { showToast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [departments, setDepartments] = useState(departmentData)

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

  const handleSearch = (text: string) => {
    setSearchQuery(text)
    if (text.trim() === "") {
      setDepartments(departmentData)
    } else {
      const filtered = departmentData.filter((dept) => dept.name.toLowerCase().includes(text.toLowerCase()))
      setDepartments(filtered)
    }
  }

  const renderDepartmentItem = ({ item }: { item: (typeof departmentData)[0] }) => (
    <View style={styles.departmentCard}>
      <View style={styles.departmentHeader}>
        <Text style={styles.departmentName}>{item.name}</Text>
        <View
          style={[
            styles.efficiencyBadge,
            {
              backgroundColor: getEfficiencyColor(item.efficiency),
            },
          ]}
        >
          <Text style={styles.efficiencyText}>{item.efficiency}%</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={[styles.statIconContainer, { backgroundColor: 'rgba(94, 114, 228, 0.1)' }]}>
            <Package width={16} height={16} color="#5e72e4" />
          </View>
          <Text style={styles.statValue}>{item.sent}</Text>
          <Text style={styles.statLabel}>Yuborilgan</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.statIconContainer, { backgroundColor: 'rgba(45, 206, 137, 0.1)' }]}>
            <Activity width={16} height={16} color="#2dce89" />
          </View>
          <Text style={[styles.statValue, { color: '#2dce89' }]}>{item.received}</Text>
          <Text style={styles.statLabel}>Qabul qilingan</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.statIconContainer, { backgroundColor: 'rgba(251, 99, 64, 0.1)' }]}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#fb6340' }}>Δ</Text>
          </View>
          <Text style={[styles.statValue, { color: '#fb6340' }]}>{item.sent - item.received}</Text>
          <Text style={styles.statLabel}>Farq</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${item.efficiency}%`,
                backgroundColor: getEfficiencyColor(item.efficiency),
              },
            ]}
          />
        </View>
      </View>
    </View>
  )

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return "#2dce89"
    if (efficiency >= 90) return "#5e72e4"
    if (efficiency >= 80) return "#fb6340"
    return "#f5365c"
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      <LinearGradient
        colors={['#5e72e4', '#324cdd']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft width={24} height={24} color="white" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Bo'limlar statistikasi</Text>
            <Text style={styles.headerSubtitle}>Barcha bo'limlar faoliyati</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search width={20} height={20} color="#8898aa" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Bo'lim nomini qidirish..."
              placeholderTextColor="#8898aa"
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.contentContainer}>


        <FlatList
          data={departments}
          renderItem={renderDepartmentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.summaryContainer}>
              <View style={styles.summaryCard}>
                <View style={[styles.summaryIconContainer, { backgroundColor: 'rgba(94, 114, 228, 0.1)' }]}>
                  <Users width={20} height={20} color="#5e72e4" />
                </View>
                <Text style={styles.summaryValue}>{departmentData.length}</Text>
                <Text style={styles.summaryLabel}>Jami bo'limlar</Text>
              </View>

              <View style={styles.summaryCard}>
                <View style={[styles.summaryIconContainer, { backgroundColor: 'rgba(45, 206, 137, 0.1)' }]}>
                  <Package width={20} height={20} color="#2dce89" />
                </View>
                <Text style={[styles.summaryValue, { color: '#2dce89' }]}>
                  {departmentData.reduce((sum, dept) => sum + dept.sent, 0)}
                </Text>
                <Text style={styles.summaryLabel}>Jami yuborilgan</Text>
              </View>

              <View style={styles.summaryCard}>
                <View style={[styles.summaryIconContainer, { backgroundColor: 'rgba(17, 205, 239, 0.1)' }]}>
                  <Activity width={20} height={20} color="#11cdef" />
                </View>
                <Text style={[styles.summaryValue, { color: '#11cdef' }]}>
                  {departmentData.reduce((sum, dept) => sum + dept.received, 0)}
                </Text>
                <Text style={styles.summaryLabel}>Jami qabul</Text>
              </View>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#5e72e4"]}
              tintColor="#5e72e4"
              progressBackgroundColor="#ffffff"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fe",
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 30
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#32325d",
  },
  contentContainer: {
    flex: 1,
    marginTop: -20,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 16,
    paddingTop: 40
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    width: "31%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5e72e4",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#8898aa",
    textAlign: "center",
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 100,
  },
  departmentCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  departmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  departmentName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#32325d",
  },
  efficiencyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  efficiencyText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5e72e4",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#8898aa",
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBackground: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
})

export default DepartmentStatsScreen