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
import { Search, Plus, Filter, X } from "react-native-feather"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import type { TransferItem, ReceiveItem, JourneyStep } from "../types"
import TransferCard from "../components/cards/TransferCard"
import AddTransferModal from "../components/modals/AddTransferModal"
import ReceiveModal from "../components/modals/ReceiveModal"
import TransferModal from "../components/modals/TransferModal"
import ReceiveCard from "../components/cards/ReceiveCard"
import LinearGradient from "react-native-linear-gradient"
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet"

// Mock data with more items
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
  {
    id: "2",
    fullName: "user",
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
    fullName: "user",
    sendDate: "2023-05-17",
    sendTime: "09:15",
    senderDepartment: "ombor",
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
      { department: "ombor", date: "2023-05-17", status: "completed" },
      { department: "Qadoqlash", date: "2023-05-18", status: "current" },
    ],
  },
  {
    id: "4",
    fullName: "user",
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
    fullName: "user",
    sendDate: "2023-05-19",
    sendTime: "08:45",
    senderDepartment: "Qadoqlash",
    receiverDepartment: "ombor",
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
      { department: "ombor", date: "2023-05-20", status: "current" },
    ],
  },
  {
    id: "6",
    fullName: "user",
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
  {
    id: "2",
    fullName: "user",
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
    fullName: "user",
    receiveDate: "2023-05-17",
    receiveTime: "13:15",
    senderDepartment: "ombor",
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
      { department: "ombor", date: "2023-05-17", status: "completed" },
      { department: "Qadoqlash", date: "2023-05-18", status: "current" },
    ],
  },
  {
    id: "4",
    fullName: "user",
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
    fullName: "user",
    receiveDate: "2023-05-20",
    receiveTime: "10:15",
    senderDepartment: "Qadoqlash",
    receiverDepartment: "ombor",
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
      { department: "ombor", date: "2023-05-20", status: "current" },
    ],
  },
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

  // Bottom Sheet Filter State
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [filterValues, setFilterValues] = useState({
    senderDepartment: "",
    receiverDepartment: "",
    model: "",
    materialType: "",
    color: "",
    size: "",
  })

  // Mock data for filter dropdowns
  const departments = ["Tikuv", "Ombor", "Bichish", "Qadoqlash"]
  const models = ["Model A", "Model B", "Model C", "Model D"]
  const materials = ["Paxta", "Ipak", "Jun", "Sintetika"]
  const colors = ["Qora", "Oq", "Ko'k", "Qizil", "Yashil"]
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

  // Bottom Sheet snap points
  const snapPoints = useMemo(() => ["65%"], ["100%"])

  // Bottom Sheet callbacks
  const handlePresentFilterSheet = useCallback(() => {
    bottomSheetRef.current?.expand()
  }, [])

  const handleApplyFilter = useCallback(() => {
    // Implement filter logic here
    showToast({
      type: "success",
      message: "Filtrlar qo'llanildi",
    })
    bottomSheetRef.current?.close()
  }, [filterValues, showToast])

  const handleResetFilter = useCallback(() => {
    setFilterValues({
      senderDepartment: "",
      receiverDepartment: "",
      model: "",
      materialType: "",
      color: "",
      size: "",
    })
  }, [])

  // Bottom Sheet backdrop component
  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  )

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

  const renderFilterSelectItem = (label: string, value: string, options: string[], field: keyof typeof filterValues) => (
    <View style={styles.selectContainer}>
      <Text style={styles.filterLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, filterValues[field] === option && styles.selectedOption]}
            onPress={() => setFilterValues({ ...filterValues, [field]: option })}
            activeOpacity={0.7}
          >
            <Text style={[styles.optionText, filterValues[field] === option && styles.selectedOptionText]}>{option}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={styles.indicator}
        enableContentPanningGesture={false}
      >
        <View style={styles.contentContainer}>
          <View style={styles.headerContent}>
            <Text style={styles.filterTitle}>Filtrlash</Text>
          </View>

          <ScrollView style={styles.scrollView}>
            {renderFilterSelectItem("Yuboruvchi bo'lim", filterValues.senderDepartment, departments, "senderDepartment")}
            {renderFilterSelectItem("Qabul qiluvchi bo'lim", filterValues.receiverDepartment, departments, "receiverDepartment")}
            {renderFilterSelectItem("Model", filterValues.model, models, "model")}
            {renderFilterSelectItem("Mato turi", filterValues.materialType, materials, "materialType")}
            {renderFilterSelectItem("Rangi", filterValues.color, colors, "color")}
            {renderFilterSelectItem("O'lchami", filterValues.size, sizes, "size")}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetFilter}
              activeOpacity={0.7}
            >
              <Text style={styles.resetButtonText}>Tozalash</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyFilter}
              activeOpacity={0.7}
            >
              <Text style={styles.applyButtonText}>Qo'llash</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>

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
  // Filter Bottom Sheet Styles
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
  contentContainer: {
    flex: 1,
  },
  indicator: {
    backgroundColor: "#5e72e4",
    width: 40,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    paddingLeft: 20
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    padding: 20,
    maxHeight: 400
  },
  selectContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#525f7f",
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#f8f9fe",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e6e9f0",
  },
  selectedOption: {
    backgroundColor: "#5e72e4",
    borderColor: "#5e72e4",
  },
  optionText: {
    color: "#525f7f",
    fontWeight: "500",
  },
  selectedOptionText: {
    color: "white",
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e6e9f0",
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#f8f9fe",
    padding: 14,
    borderRadius: 12,
    marginRight: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e6e9f0",
  },
  resetButtonText: {
    color: "#525f7f",
    fontWeight: "600",
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#5e72e4",
    padding: 14,
    borderRadius: 12,
    marginLeft: 8,
    alignItems: "center",
    shadowColor: "#5e72e4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    color: "white",
    fontWeight: "600",
  },
})

export default HomeScreen