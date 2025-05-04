"use client"

import { useState, useCallback } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl, TextInput } from "react-native"
import { Search, Plus } from "react-native-feather"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import TransferCard from "../components/TransferCard"
import FilterBottomSheet from "../components/FilterBottomSheet"
import AddTransferModal from "../components/AddTransferModal"
import ReceiveModal from "../components/ReceiveModal"
import TransferModal from "../components/TransferModal"
import type { TransferItem, ReceiveItem, JourneyStep } from "../types"

// Mock data with more items
const mockTransferItems: TransferItem[] = [
  {
    id: "1",
    fullName: "Alisher Navoiy",
    sendDate: "2023-05-15",
    sendTime: "10:30",
    senderDepartment: "Tikuv",
    receiverDepartment: "Ombor",
    model: "Model A",
    materialType: "Paxta",
    totalCount: 100,
    receivedCount: 80,
    color: "Ko'k",
    size: "M",
    additionalNotes: "Tez yuborish kerak",
    status: "partial",
    journey: [
      { department: "Tikuv", date: "2023-05-15", status: "completed" },
      { department: "Ombor", date: "2023-05-16", status: "current" },
      { department: "Bichish", date: "", status: "pending" },
      { department: "Qadoqlash", date: "", status: "pending" },
    ],
  },
  {
    id: "2",
    fullName: "Bobur Mirzo",
    sendDate: "2023-05-16",
    sendTime: "11:45",
    senderDepartment: "Bichish",
    receiverDepartment: "Tikuv",
    model: "Model B",
    materialType: "Ipak",
    totalCount: 50,
    receivedCount: 50,
    color: "Qizil",
    size: "L",
    additionalNotes: "",
    status: "completed",
    journey: [
      { department: "Bichish", date: "2023-05-16", status: "completed" },
      { department: "Tikuv", date: "2023-05-17", status: "current" },
    ],
  },
  {
    id: "3",
    fullName: "Ulug'bek Mirzo",
    sendDate: "2023-05-17",
    sendTime: "09:15",
    senderDepartment: "Ombor",
    receiverDepartment: "Qadoqlash",
    model: "Model C",
    materialType: "Jun",
    totalCount: 75,
    receivedCount: 25,
    color: "Qora",
    size: "XL",
    additionalNotes: "Ehtiyot qiling",
    status: "partial",
    journey: [
      { department: "Ombor", date: "2023-05-17", status: "completed" },
      { department: "Qadoqlash", date: "2023-05-18", status: "current" },
    ],
  },
  {
    id: "4",
    fullName: "Abdulla Qodiriy",
    sendDate: "2023-05-18",
    sendTime: "14:20",
    senderDepartment: "Tikuv",
    receiverDepartment: "Bichish",
    model: "Model D",
    materialType: "Paxta",
    totalCount: 120,
    receivedCount: 60,
    color: "Yashil",
    size: "S",
    additionalNotes: "Maxsus buyurtma",
    status: "partial",
    journey: [
      { department: "Tikuv", date: "2023-05-18", status: "completed" },
      { department: "Bichish", date: "2023-05-19", status: "current" },
    ],
  },
  {
    id: "5",
    fullName: "Zulfiya Isroilova",
    sendDate: "2023-05-19",
    sendTime: "08:45",
    senderDepartment: "Qadoqlash",
    receiverDepartment: "Ombor",
    model: "Model A",
    materialType: "Sintetika",
    totalCount: 80,
    receivedCount: 80,
    color: "Ko'k",
    size: "XL",
    additionalNotes: "",
    status: "completed",
    journey: [
      { department: "Qadoqlash", date: "2023-05-19", status: "completed" },
      { department: "Ombor", date: "2023-05-20", status: "current" },
    ],
  },
  {
    id: "6",
    fullName: "Erkin Vohidov",
    sendDate: "2023-05-20",
    sendTime: "11:30",
    senderDepartment: "Bichish",
    receiverDepartment: "Tikuv",
    model: "Model B",
    materialType: "Jun",
    totalCount: 60,
    receivedCount: 0,
    color: "Qora",
    size: "M",
    additionalNotes: "Tezkor buyurtma",
    status: "pending",
    journey: [
      { department: "Bichish", date: "2023-05-20", status: "completed" },
      { department: "Tikuv", date: "", status: "pending" },
    ],
  },
]

const mockReceiveItems: ReceiveItem[] = [
  {
    id: "1",
    fullName: "Alisher Navoiy",
    receiveDate: "2023-05-15",
    receiveTime: "14:30",
    senderDepartment: "Tikuv",
    receiverDepartment: "Ombor",
    model: "Model A",
    materialType: "Paxta",
    sentCount: 100,
    receivedCount: 80,
    difference: 20,
    color: "Ko'k",
    size: "M",
    additionalNotes: "Tez yuborish kerak",
    journey: [
      { department: "Tikuv", date: "2023-05-15", status: "completed" },
      { department: "Ombor", date: "2023-05-16", status: "current" },
      { department: "Bichish", date: "", status: "pending" },
      { department: "Qadoqlash", date: "", status: "pending" },
    ],
  },
  {
    id: "2",
    fullName: "Bobur Mirzo",
    receiveDate: "2023-05-16",
    receiveTime: "15:45",
    senderDepartment: "Bichish",
    receiverDepartment: "Tikuv",
    model: "Model B",
    materialType: "Ipak",
    sentCount: 50,
    receivedCount: 50,
    difference: 0,
    color: "Qizil",
    size: "L",
    additionalNotes: "",
    journey: [
      { department: "Bichish", date: "2023-05-16", status: "completed" },
      { department: "Tikuv", date: "2023-05-17", status: "current" },
    ],
  },
  {
    id: "3",
    fullName: "Ulug'bek Mirzo",
    receiveDate: "2023-05-17",
    receiveTime: "13:15",
    senderDepartment: "Ombor",
    receiverDepartment: "Qadoqlash",
    model: "Model C",
    materialType: "Jun",
    sentCount: 75,
    receivedCount: 25,
    difference: 50,
    color: "Qora",
    size: "XL",
    additionalNotes: "Ehtiyot qiling",
    journey: [
      { department: "Ombor", date: "2023-05-17", status: "completed" },
      { department: "Qadoqlash", date: "2023-05-18", status: "current" },
    ],
  },
  {
    id: "4",
    fullName: "Abdulla Qodiriy",
    receiveDate: "2023-05-19",
    receiveTime: "09:30",
    senderDepartment: "Tikuv",
    receiverDepartment: "Bichish",
    model: "Model D",
    materialType: "Paxta",
    sentCount: 120,
    receivedCount: 60,
    difference: 60,
    color: "Yashil",
    size: "S",
    additionalNotes: "Maxsus buyurtma",
    journey: [
      { department: "Tikuv", date: "2023-05-18", status: "completed" },
      { department: "Bichish", date: "2023-05-19", status: "current" },
    ],
  },
  {
    id: "5",
    fullName: "Zulfiya Isroilova",
    receiveDate: "2023-05-20",
    receiveTime: "10:15",
    senderDepartment: "Qadoqlash",
    receiverDepartment: "Ombor",
    model: "Model A",
    materialType: "Sintetika",
    sentCount: 80,
    receivedCount: 80,
    difference: 0,
    color: "Ko'k",
    size: "XL",
    additionalNotes: "",
    journey: [
      { department: "Qadoqlash", date: "2023-05-19", status: "completed" },
      { department: "Ombor", date: "2023-05-20", status: "current" },
    ],
  },
]

const HomeScreen = () => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<"send" | "receive">("send")
  const [searchQuery, setSearchQuery] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [transferItems, setTransferItems] = useState<TransferItem[]>(mockTransferItems)
  const [receiveItems, setReceiveItems] = useState<ReceiveItem[]>(mockReceiveItems)
  const [filters, setFilters] = useState({})
  const [showAddModal, setShowAddModal] = useState(false)
  const [showReceiveModal, setShowReceiveModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<TransferItem | ReceiveItem | null>(null)

  // Filter items based on user's department
  const filteredTransferItems = transferItems.filter(
    (item) => item.senderDepartment === user?.department || item.fullName === user?.fullName,
  )

  // Filter pending transfer items for receiving
  const pendingTransferItems = transferItems.filter(
    (item) => item.receiverDepartment === user?.department && item.receivedCount < item.totalCount,
  )

  // Filter received items for this department
  const receivedItems = receiveItems.filter((item) => item.receiverDepartment === user?.department)

  const onRefresh = useCallback(() => {
    setIsRefreshing(true)
    // Simulate data fetching
    setTimeout(() => {
      setIsRefreshing(false)
      showToast({
        type: "success",
        message: "Ma'lumotlar yangilandi",
      })
    }, 1500)
  }, [])

  const handleSearch = (text: string) => {
    setSearchQuery(text)
    // Implement search logic here
  }

  const handleApplyFilter = (newFilters: any) => {
    setFilters(newFilters)
    showToast({
      type: "success",
      message: "Filtrlar qo'llanildi",
    })
    // Implement filter logic here
  }

  const handleAddTransfer = (newItem: TransferItem) => {
    setTransferItems([newItem, ...transferItems])
  }

  const handleReceiveItem = (item: TransferItem) => {
    setSelectedItem(item)
    setShowReceiveModal(true)
  }

  const handleTransferItem = (item: TransferItem | ReceiveItem) => {
    setSelectedItem(item)
    setShowTransferModal(true)
  }

  const handleReceiveSubmit = (receivedCount: number, notes: string) => {
    if (!selectedItem) return

    // Update transfer item
    const updatedTransferItems = transferItems.map((item) => {
      if (item.id === selectedItem.id) {
        const newReceivedCount = item.receivedCount + receivedCount
        const newStatus: "completed" | "partial" | "pending" =
          newReceivedCount >= item.totalCount ? "completed" : "partial"
        return {
          ...item,
          receivedCount: newReceivedCount,
          status: newStatus,
        }
      }
      return item
    })

    // Create new receive item
    const newReceiveItem: ReceiveItem = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: user?.fullName || "Nomalum foydalanuvchi",
      receiveDate: new Date().toLocaleDateString(),
      receiveTime: new Date().toLocaleTimeString(),
      senderDepartment: (selectedItem as TransferItem).senderDepartment,
      receiverDepartment: (selectedItem as TransferItem).receiverDepartment,
      model: selectedItem.model,
      materialType: selectedItem.materialType,
      sentCount: (selectedItem as TransferItem).totalCount,
      receivedCount: receivedCount,
      difference: (selectedItem as TransferItem).totalCount - receivedCount,
      color: selectedItem.color,
      size: selectedItem.size,
      additionalNotes: notes,
      journey: selectedItem.journey,
    }

    setTransferItems(updatedTransferItems)
    setReceiveItems([newReceiveItem, ...receiveItems])
    setShowReceiveModal(false)
    setSelectedItem(null)

    showToast({
      type: "success",
      message: "Muvaffaqiyatli qabul qilindi",
    })
  }

  const handleTransferSubmit = (receiverDepartment: string, count: number, notes: string) => {
    if (!selectedItem || !user) return

    const today = new Date().toLocaleDateString()

    // Create new journey steps
    let newJourney: JourneyStep[] = []
    if (selectedItem.journey) {
      // Update existing journey
      newJourney = selectedItem.journey.map((step) => {
        if (step.status === "current") {
          return { ...step, status: "completed" }
        }
        if (step.department === receiverDepartment && step.status === "pending") {
          return { department: receiverDepartment, date: today, status: "current" }
        }
        return step
      })

      // If the receiver department is not in the journey, add it
      if (!newJourney.some((step) => step.department === receiverDepartment)) {
        newJourney.push({ department: receiverDepartment, date: today, status: "current" })
      }
    } else {
      // Create new journey
      newJourney = [
        { department: user.department, date: today, status: "completed" },
        { department: receiverDepartment, date: today, status: "current" },
      ]
    }

    // Create new transfer item
    const newTransferItem: TransferItem = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: user.fullName,
      sendDate: today,
      sendTime: new Date().toLocaleTimeString(),
      senderDepartment: user.department,
      receiverDepartment: receiverDepartment,
      model: selectedItem.model,
      materialType: selectedItem.materialType,
      totalCount: count,
      receivedCount: 0,
      color: selectedItem.color,
      size: selectedItem.size,
      additionalNotes: notes,
      status: "pending",
      journey: newJourney,
    }

    setTransferItems([newTransferItem, ...transferItems])
    setShowTransferModal(false)
    setSelectedItem(null)

    showToast({
      type: "success",
      message: "Muvaffaqiyatli uzatildi",
    })
  }

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Ma'lumotlar topilmadi</Text>
    </View>
  )

  const renderTransferItem = ({ item }: { item: TransferItem }) => (
    <View>
      <TransferCard item={item} />
      {/* Uzatish button removed from transfer cards */}
    </View>
  )

  const renderReceiveItem = ({ item }: { item: TransferItem }) => (
    <View>
      <TransferCard item={item} />
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.receiveButton} onPress={() => handleReceiveItem(item)}>
          <Text style={styles.receiveButtonText}>Qabul qilish</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.transferButton} onPress={() => handleTransferItem(item)}>
          <Text style={styles.transferButtonText}>Uzatish</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Asosiy sahifa</Text>
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
        <FilterBottomSheet onApplyFilter={handleApplyFilter} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "send" && styles.activeTab]}
          onPress={() => setActiveTab("send")}
        >
          <Text style={[styles.tabText, activeTab === "send" && styles.activeTabText]}>Uzatish</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "receive" && styles.activeTab]}
          onPress={() => setActiveTab("receive")}
        >
          <Text style={[styles.tabText, activeTab === "receive" && styles.activeTabText]}>Qabul qilish</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "send" ? (
        <FlatList
          data={filteredTransferItems}
          renderItem={renderTransferItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={["#3498db"]} />}
          ListEmptyComponent={renderEmptyList}
        />
      ) : (
        <FlatList
          data={pendingTransferItems}
          renderItem={renderReceiveItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={["#3498db"]} />}
          ListEmptyComponent={renderEmptyList}
        />
      )}

      {user?.department === "Ombor" && (
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Plus width={24} height={24} color="white" />
        </TouchableOpacity>
      )}

      <AddTransferModal visible={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddTransfer} />
      <ReceiveModal
        visible={showReceiveModal}
        onClose={() => setShowReceiveModal(false)}
        onReceive={handleReceiveSubmit}
        item={selectedItem as TransferItem}
      />
      <TransferModal
        visible={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onTransfer={handleTransferSubmit}
        item={selectedItem}
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
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  searchInputContainer: {
    flex: 1,
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#3498db",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  activeTabText: {
    color: "white",
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  addButton: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  receiveButton: {
   flex: 1,
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 8,
    marginLeft: 5,
    alignItems: "center",
    marginBottom: 16,
  },
  receiveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  transferButton: {
    flex: 1,
    backgroundColor: "#2ecc71",
    padding: 12,
    borderRadius: 8,
    marginLeft: 5,
    alignItems: "center",
    marginBottom: 16,
  },
  transferButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: -8,
    marginBottom: 16,
  },
})

export default HomeScreen
