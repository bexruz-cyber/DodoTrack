import { useState, useCallback, useRef } from "react"
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
import { useAppData } from "../api/categoryData"
import { renderEmptyList } from "../components/emptyList"

const mockTransferItems: TransferItem[] = [
  {
    id: "1",
    fullName: "user",
    sendDate: "2023-05-15",
    sendTime: "10:30",
    senderDepartment: "Tikuv",
    receiverDepartment: "ombor",
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
      { department: "ombor", date: "2023-05-16", status: "current" },
      { department: "Bichish", date: "", status: "pending" },
      { department: "Qadoqlash", date: "", status: "pending" },
    ],
  },
  // ... other items remain the same
]

const mockReceiveItems: ReceiveItem[] = [
  {
    id: "1",
    fullName: "user",
    receiveDate: "2023-05-15",
    receiveTime: "14:30",
    senderDepartment: "Tikuv",
    receiverDepartment: "ombor",
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
      { department: "ombor", date: "2023-05-16", status: "current" },
      { department: "Bichish", date: "", status: "pending" },
      { department: "Qadoqlash", date: "", status: "pending" },
    ],
  },
  // ... other items remain the same
]

const HomeScreen = () => {
  // user
  const { user } = useAuth()

  // toast
  const { showToast } = useToast()

  // tab
  const [activeTab, setActiveTab] = useState<"send" | "receive" | "add">("add")
  // seach query
  const [searchQuery, setSearchQuery] = useState("")
  // refresh
  const [isRefreshing, setIsRefreshing] = useState(false)

  // data
  const [originalTransferItems] = useState<TransferItem[]>(mockTransferItems)
  const [originalReceiveItems] = useState<ReceiveItem[]>(mockReceiveItems)
  const { employeeTypes, colors, sizes } = useAppData()

  // filter
  const [activeFilters, setActiveFilters] = useState({
    color: "",
    size: "",
    employeeType: ""
  })
  const bottomSheetRef = useRef<BottomSheet>(null)


  // modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [showReceiveModal, setShowReceiveModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<TransferItem | ReceiveItem | null>(null)



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

  
  // reload
  const onRefresh = useCallback(() => {
    setIsRefreshing(true)
    // Simulate data fetching
    setTimeout(() => {
      // Reset to original data
      if (activeTab === "send") {
      } else {
      }

      setSearchQuery("")

      setIsRefreshing(false)
      showToast({
        type: "success",
        message: "Ma'lumotlar yangilandi",
      })
    }, 1500)
  }, [activeTab, showToast, originalTransferItems, originalReceiveItems])


  // modal functions
  const handleReceiveItem = (item: ReceiveItem) => {
    setSelectedItem(item)
    setShowReceiveModal(true)
  }

  const handleTransferItem = (item: TransferItem | ReceiveItem) => {
    setSelectedItem(item)
    setShowTransferModal(true)
  }

  const handleReceiveSubmit = (receivedCount: number, notes: string) => {
    // Implement receive submit logic
    showToast({
      type: "success",
      message: "Ma'lumot qabul qilindi",
    })
    setShowReceiveModal(false)
  }

  const handleTransferSubmit = (receiverDepartment: string, count: number, notes: string) => {
    // Implement transfer submit logic
    showToast({
      type: "success",
      message: "Ma'lumot uzatildi",
    })
    setShowTransferModal(false)
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      <LinearGradient
        colors={['#5e72e4', '#324cdd']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.title}>Asosiy sahifa</Text>
        <Text style={styles.subtitle}>{user?.department.name} bo'limi</Text>
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

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "add" && styles.activeTab]}
          onPress={() => setActiveTab("add")}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === "add" && styles.activeTabText]}>Qo'shish</Text>
        </TouchableOpacity>
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

      {activeTab === "add" ?
        <FlatList
          data={originalReceiveItems}
          renderItem={
            ({ item }: { item: ReceiveItem }) => (
              <View>
                <ReceiveCard item={item} />
                <View style={styles.buttonRow}>
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
          }
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
        :
        <>
          {activeTab === "send" ? (
            <FlatList
              data={originalTransferItems}
              renderItem={({ item }: { item: TransferItem }) => (
                <TransferCard item={item} />
              )}
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
              data={originalReceiveItems}
              renderItem={
                ({ item }: { item: ReceiveItem }) => (
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
              }
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
        </>
      }

      {user?.department.name === "ombor" && activeTab === "add" && (
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
        colors={colors || []}
        sizes={sizes || []}
        employeeTypes={employeeTypes || []}
        initialValues={activeFilters}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
      />

      <AddTransferModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
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
    marginTop: 2,
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