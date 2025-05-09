import { useCallback, useRef, useState } from "react"
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
import ItemJourney from "../components/ItemJourney"
import { Search, ArrowLeft, Tag, Layers, Filter } from "react-native-feather"
import { useNavigation } from "@react-navigation/native"
import LinearGradient from "react-native-linear-gradient"
import type { ProductTrackingItem } from "../types"
import BottomSheet from "@gorhom/bottom-sheet"
import FilterBottomSheet from "../components/FilterBottomSheet"
import { useAppData } from "../api/categoryData"

const productTrackingData: ProductTrackingItem[] = [
  {
    id: "1",
    model: "Model A",
    materialType: "Paxta",
    color: "Ko'k",
    size: "M",
    currentDepartment: "Tikuv",
    journey: [
      { department: "Ombor", date: "2023-05-10", status: "completed" },
      { department: "Bichish", date: "2023-05-12", status: "completed" },
      { department: "Tikuv", date: "2023-05-15", status: "current" },
      { department: "Qadoqlash", date: "", status: "pending" },
    ],
  },
  {
    id: "2",
    model: "Model B",
    materialType: "Ipak",
    color: "Qizil",
    size: "L",
    currentDepartment: "Bichish",
    journey: [
      { department: "Ombor", date: "2023-05-14", status: "completed" },
      { department: "Bichish", date: "2023-05-16", status: "current" },
      { department: "Tikuv", date: "", status: "pending" },
      { department: "Qadoqlash", date: "", status: "pending" },
    ],
  },
  {
    id: "3",
    model: "Model C",
    materialType: "Jun",
    color: "Qora",
    size: "XL",
    currentDepartment: "Qadoqlash",
    journey: [
      { department: "Ombor", date: "2023-05-11", status: "completed" },
      { department: "Bichish", date: "2023-05-13", status: "completed" },
      { department: "Tikuv", date: "2023-05-15", status: "completed" },
      { department: "Qadoqlash", date: "2023-05-17", status: "current" },
    ],
  },
  {
    id: "4",
    model: "Model D",
    materialType: "Paxta",
    color: "Yashil",
    size: "S",
    currentDepartment: "Bichish",
    journey: [
      { department: "Ombor", date: "2023-05-18", status: "completed" },
      { department: "Bichish", date: "2023-05-20", status: "current" },
      { department: "Tikuv", date: "", status: "pending" },
    ],
  },
  {
    id: "5",
    model: "Model A",
    materialType: "Sintetika",
    color: "Ko'k",
    size: "XL",
    currentDepartment: "Ombor",
    journey: [
      { department: "Tikuv", date: "2023-05-15", status: "completed" },
      { department: "Qadoqlash", date: "2023-05-17", status: "completed" },
      { department: "Ombor", date: "2023-05-19", status: "current" },
    ],
  },
  {
    id: "6",
    model: "Model B",
    materialType: "Jun",
    color: "Qora",
    size: "M",
    currentDepartment: "Tikuv",
    journey: [
      { department: "Ombor", date: "2023-05-12", status: "completed" },
      { department: "Bichish", date: "2023-05-14", status: "completed" },
      { department: "Tikuv", date: "2023-05-16", status: "current" },
      { department: "Qadoqlash", date: "", status: "pending" },
    ],
  },
]

const ProductTrackingScreen = () => {
  const { showToast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [products, setProducts] = useState<ProductTrackingItem[]>(productTrackingData)
  const { employeeTypes, colors, sizes } = useAppData()

  // Bottom Sheet ref

  const [activeFilters, setActiveFilters] = useState({
    color: "",
    size: "",
    employeeType: ""
  })
  const bottomSheetRef = useRef<BottomSheet>(null)

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      showToast({
        type: "success",
        message: "Ma'lumotlar yangilandi",
      })
    }, 1500)
  }

  // filter functions
  const handlePresentFilterSheet = useCallback(() => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.expand()
    }
  }, [])

  const handleApplyFilter = useCallback((filterValues: any) => {
    setActiveFilters(filterValues)

    // Here you would normally filter your data
    // But for now we're just showing a toast as requested
    showToast({
      type: "success",
      message: "Filtrlar qo'llanildi",
    })
  }, [showToast])

  const handleResetFilter = useCallback(() => {
    setActiveFilters({
      color: "",
      size: "",
      employeeType: ""
    })

    showToast({
      type: "info",
      message: "Filtrlar tozalandi",
    })
  }, [showToast])

  // Get color for department badge
  const getDepartmentColor = (department: string) => {
    const colorMap: Record<string, string> = {
      "Tikuv": "#5e72e4",
      "Ombor": "#2dce89",
      "Bichish": "#fb6340",
      "Qadoqlash": "#11cdef",
      // Add more departments as needed
    }
    return colorMap[department] || "#8898aa" // Default color if not found
  }

  const renderProductItem = ({ item }: { item: ProductTrackingItem }) => (
    <View style={styles.productCard}>
      <View style={styles.productHeader}>
        <Text style={styles.productTitle}>{item.model}</Text>
        <View style={[
          styles.productBadge,
          { backgroundColor: getDepartmentColor(item.currentDepartment) }
        ]}>
          <Text style={styles.productBadgeText}>{item.currentDepartment}</Text>
        </View>
      </View>

      <View style={styles.productDetails}>
        <View style={styles.detailItem}>
          <View style={styles.iconContainer}>
            <Layers width={16} height={16} color="#5e72e4" />
          </View>
          <Text style={styles.productDetail}>{item.materialType}</Text>
        </View>

        <View style={styles.detailItem}>
          <View style={[
            styles.colorDot,
            { backgroundColor: getColorCode(item.color) }
          ]} />
          <Text style={styles.productDetail}>{item.color}</Text>
        </View>

        <View style={styles.detailItem}>
          <View style={styles.iconContainer}>
            <Tag width={16} height={16} color="#5e72e4" />
          </View>
          <Text style={styles.productDetail}>{item.size}</Text>
        </View>
      </View>

      <ItemJourney steps={item.journey} />
    </View>
  )

  // Helper function to get color code from color name
  const getColorCode = (colorName: string) => {
    const colorMap: Record<string, string> = {
      "Ko'k": "#3498db",
      "Qizil": "#e74c3c",
      "Qora": "#2c3e50",
      "Yashil": "#2ecc71",
      // Add more colors as needed
    }
    return colorMap[colorName] || "#95a5a6" // Default color if not found
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
          <View>
            <Text style={styles.headerTitle}>Mahsulot kuzatuvi</Text>
            <Text style={styles.headerSubtitle}>Barcha mahsulotlar holati</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search width={20} height={20} color="#8898aa" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Qidirish..."
            value={searchQuery}
            placeholderTextColor="#8898aa"
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={handlePresentFilterSheet}
          activeOpacity={0.7}
        >
          <Filter width={18} height={18} color="white" />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        style={{ paddingTop: 20 }}
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

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet
        ref={bottomSheetRef}
        colors={colors || []}
        sizes={sizes || []}
        employeeTypes={employeeTypes || []}
        initialValues={activeFilters}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
      />
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
    paddingBottom: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10
  },
  searchInputContainer: {
    flex: 1,
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
  listContent: {
    padding: 16,
    paddingBottom: 100,
    marginTop: -20,
  },
  productCard: {
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
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#32325d",
  },
  productBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  productBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  productDetails: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(94, 114, 228, 0.05)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(94, 114, 228, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 6,
  },
  productDetail: {
    fontSize: 14,
    color: "#32325d",
  },
  filterButton: {
    backgroundColor: "#5e72e4",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  filterButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 6,
  },
})

export default ProductTrackingScreen