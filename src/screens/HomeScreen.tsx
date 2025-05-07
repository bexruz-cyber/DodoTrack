import { useState, useCallback, useRef, useMemo } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  TextInput,
  Platform,
  StatusBar,
  ScrollView
} from "react-native"
import { Search, Plus, Filter } from "react-native-feather"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import type { TransferItem, ReceiveItem } from "../types"
import TransferCard from "../components/cards/TransferCard"
import AddTransferModal from "../components/modals/AddTransferModal"
import ReceiveModal from "../components/modals/ReceiveModal"
import TransferModal from "../components/modals/TransferModal"
import ReceiveCard from "../components/cards/ReceiveCard"
import LinearGradient from "react-native-linear-gradient"
import BottomSheet from "@gorhom/bottom-sheet"
import FilterBottomSheet from "../components/FilterBottomSheet"

// Mock data with more items
const mockTransferItems: TransferItem[] = [
  // ... transfer items data
]

const mockReceiveItems: ReceiveItem[] = [
  // ... receive items data
]

const HomeScreen = () => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<"send" | "receive">("send")
  const [searchQuery, setSearchQuery] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [transferItems, setTransferItems] = useState<TransferItem[]>(mockTransferItems)
  const [receiveItems, setReceiveItems] = useState<ReceiveItem[]>(mockReceiveItems)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showReceiveModal, setShowReceiveModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<TransferItem | ReceiveItem | null>(null)

  // Bottom Sheet Filter ref
  const bottomSheetRef = useRef<BottomSheet>(null)

  // Mock data for filter dropdowns
  const departments = ["Tikuv", "Ombor", "Bichish", "Qadoqlash"]
  const models = ["Model A", "Model B", "Model C", "Model D"]
  const materials = ["Paxta", "Ipak", "Jun", "Sintetika"]
  const colors = ["Qora", "Oq", "Ko'k", "Qizil", "Yashil"]
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

  // Filter options for send tab
  const sendFilterOptions = [
    { label: "Yuboruvchi bo'lim", value: "", options: departments, field: "senderDepartment" },
    { label: "Qabul qiluvchi bo'lim", value: "", options: departments, field: "receiverDepartment" },
    { label: "Model", value: "", options: models, field: "model" },
    { label: "Mato turi", value: "", options: materials, field: "materialType" },
    { label: "Rangi", value: "", options: colors, field: "color" },
    { label: "O'lchami", value: "", options: sizes, field: "size" },
  ]

  // Filter options for receive tab
  const receiveFilterOptions = [
    { label: "Yuboruvchi bo'lim", value: "", options: departments, field: "senderDepartment" },
    { label: "Qabul qiluvchi bo'lim", value: "", options: departments, field: "receiverDepartment" },
    { label: "Model", value: "", options: models, field: "model" },
    { label: "Mato turi", value: "", options: materials, field: "materialType" },
    { label: "Rangi", value: "", options: colors, field: "color" },
    { label: "O'lchami", value: "", options: sizes, field: "size" },
  ]

  const initialSendFilterValues = {
    senderDepartment: "",
    receiverDepartment: "",
    model: "",
    materialType: "",
    color: "",
    size: "",
  }

  const initialReceiveFilterValues = {
    senderDepartment: "",
    receiverDepartment: "",
    model: "",
    materialType: "",
    color: "",
    size: "",
  }

  // Bottom Sheet callbacks
  const handlePresentFilterSheet = useCallback(() => {
    bottomSheetRef.current?.expand()
  }, [])

  const handleApplyFilter = useCallback((filterValues: any) => {
    if (activeTab === "send") {
      // Filter transfer items
      let filteredItems = [...mockTransferItems]
      
      Object.keys(filterValues).forEach(key => {
        if (filterValues[key]) {
          filteredItems = filteredItems.filter(item => 
            item[key as keyof TransferItem] === filterValues[key]
          )
        }
      })
      
      setTransferItems(filteredItems)
    } else {
      // Filter receive items
      let filteredItems = [...mockReceiveItems]
      
      Object.keys(filterValues).forEach(key => {
        if (filterValues[key]) {
          filteredItems = filteredItems.filter(item => 
            item[key as keyof ReceiveItem] === filterValues[key]
          )
        }
      })
      
      setReceiveItems(filteredItems)
    }
    
    showToast({
      type: "success",
      message: "Filtrlar qo'llanildi",
    })
  }, [activeTab, showToast])

  const handleResetFilter = useCallback(() => {
    if (activeTab === "send") {
      setTransferItems(mockTransferItems)
    } else {
      setReceiveItems(mockReceiveItems)
    }
  }, [activeTab])

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
  }, [showToast])

  const handleSearch = (text: string) => {
    setSearchQuery(text)
    // Implement search logic here
    if (activeTab === "send") {
      if (text.trim() === "") {
        setTransferItems(mockTransferItems)
      } else {
        const filtered = mockTransferItems.filter(
          (item) =>
            item.model.toLowerCase().includes(text.toLowerCase()) ||
            item.materialType.toLowerCase().includes(text.toLowerCase()) ||
            item.color.toLowerCase().includes(text.toLowerCase()) ||
            item.senderDepartment.toLowerCase().includes(text.toLowerCase()) ||
            item.receiverDepartment.toLowerCase().includes(text.toLowerCase())
        )
        setTransferItems(filtered)
      }
    } else {
      if (text.trim() === "") {
        setReceiveItems(mockReceiveItems)
      } else {
        const filtered = mockReceiveItems.filter(
          (item) =>
            item.model.toLowerCase().includes(text.toLowerCase()) ||
            item.materialType.toLowerCase().includes(text.toLowerCase()) ||
            item.color.toLowerCase().includes(text.toLowerCase()) ||
            item.senderDepartment.toLowerCase().includes(text.toLowerCase()) ||
            item.receiverDepartment.toLowerCase().includes(text.toLowerCase())
        )
        setReceiveItems(filtered)
      }
    }
  }

  const handleAddTransfer = (newItem: TransferItem) => {
    setTransferItems([newItem, ...transferItems])
  }

  const handleReceiveItem = (item: ReceiveItem) => {
    setSelectedItem(item)
    setShowReceiveModal(true)
  }

  const handleTransferItem = (item: TransferItem | ReceiveItem) => {
    setSelectedItem(item)
    setShowTransferModal(true)
  }

  const handleReceiveSubmit = (receivedCount: number, notes: string) => {
    // ... existing receive submit logic
  }

  const handleTransferSubmit = (receiverDepartment: string, count: number, notes: string) => {
    // ... existing transfer submit logic
  }

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Ma'lumotlar topilmadi</Text>
    </View>
  )

  const renderTransferItem = ({ item }: { item: TransferItem }) => (
    <View>
      <TransferCard item={item} />
    </View>
  )

  const renderReceiveItem = ({ item }: { item: ReceiveItem }) => (
    <View>
      <ReceiveCard item={item} />
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.receiveButton}
          onPress={() => handleReceiveItem(item)}
          activeOpacity={0.7}
        >
          <Text style={styles.receiveButtonText}>Qabul qilish</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.transferButton}
          onPress={() => handleTransferItem(item)}
          activeOpacity={0.7}
        >
          <Text style={styles.transferButtonText}>Uzatish</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5e72e4" />

      <LinearGradient
        colors={['#5e72e4', '#324cdd']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.title}>Asosiy sahifa</Text>
        <Text style={styles.subtitle}>{user?.department} bo'limi</Text>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search width={20} height={20} color="#8898aa" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Qidirish..."
            value={searchQuery}
            onChangeText={handleSearch}
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

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "send" && styles.activeTab]}
          onPress={() => setActiveTab("send")}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === "send" && styles.activeTabText]}>Uzatish</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "receive" && styles.activeTab]}
          onPress={() => setActiveTab("receive")}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === "receive" && styles.activeTabText]}>Qabul qilish</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "send" ? (
        <FlatList
          data={transferItems}
          renderItem={renderTransferItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={["#5e72e4"]}
              tintColor="#5e72e4"
              progressBackgroundColor="#ffffff"
            />
          }
          ListEmptyComponent={renderEmptyList}
        />
      ) : (
        <FlatList
          data={receiveItems}
          renderItem={renderReceiveItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={["#5e72e4"]}
              tintColor="#5e72e4"
              progressBackgroundColor="#ffffff"
            />
          }
          ListEmptyComponent={renderEmptyList}
        />
      )}

      {user?.department === "ombor" && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
          activeOpacity={0.8}
        >
          <Plus width={24} height={24} color="white" />
        </TouchableOpacity>
      )}

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet
        ref={bottomSheetRef}
        filterOptions={activeTab === "send" ? sendFilterOptions : receiveFilterOptions}
        initialValues={activeTab === "send" ? initialSendFilterValues : initialReceiveFilterValues}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
      />

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
    backgroundColor: "#f8f9fe",
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 20,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#5e72e4",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8898aa",
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
    backgroundColor: "white",
    borderRadius: 12,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#8898aa",
  },
  addButton: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#5e72e4",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  receiveButton: {
    flex: 1,
    backgroundColor: "#5e72e4",
    padding: 14,
    borderRadius: 12,
    marginRight: 5,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  receiveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  transferButton: {
    flex: 1,
    backgroundColor: "#2dce89",
    padding: 14,
    borderRadius: 12,
    marginLeft: 5,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  transferButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: -8,
    marginBottom: 16,
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

export default HomeScreen