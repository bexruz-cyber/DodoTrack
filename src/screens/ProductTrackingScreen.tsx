"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TextInput, RefreshControl } from "react-native"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import ItemJourney from "../components/ItemJourney"
import { Search } from "react-native-feather"
import type { ProductTrackingItem } from "../types"

// Mock data for product tracking
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
  const { user } = useAuth()
  const { showToast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [products, setProducts] = useState<ProductTrackingItem[]>(productTrackingData)

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
    // Implement search logic here
  }

  const renderProductItem = ({ item }: { item: ProductTrackingItem }) => (
    <View style={styles.productCard}>
      <View style={styles.productHeader}>
        <Text style={styles.productTitle}>{item.model}</Text>
        <View style={styles.productBadge}>
          <Text style={styles.productBadgeText}>{item.currentDepartment}</Text>
        </View>
      </View>
      <View style={styles.productDetails}>
        <Text style={styles.productDetail}>Mato: {item.materialType}</Text>
        <Text style={styles.productDetail}>Rang: {item.color}</Text>
        <Text style={styles.productDetail}>O'lcham: {item.size}</Text>
      </View>
      <ItemJourney steps={item.journey} />
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tovar haritasi</Text>
        <Text style={styles.subtitle}>{user?.department} bo'limi</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search width={20} height={20} color="#95a5a6" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Qidirish..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#3498db"]} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "white",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  searchContainer: {
    padding: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
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
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  productCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  productBadge: {
    backgroundColor: "#3498db",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  productBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  productDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  productDetail: {
    fontSize: 14,
    color: "#666",
    marginRight: 12,
    marginBottom: 4,
  },
})

export default ProductTrackingScreen
