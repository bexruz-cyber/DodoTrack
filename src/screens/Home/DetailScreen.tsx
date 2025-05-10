import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform
} from "react-native"
import { useRoute, type RouteProp, useNavigation } from "@react-navigation/native"
import { useAuth } from "../../context/AuthContext"
import { useToast } from "../../context/ToastContext"
import ItemJourney from "../../components/ItemJourney"
import LinearGradient from "react-native-linear-gradient"
import { ArrowLeft, FileText, Package, User, Calendar, Layers } from "react-native-feather"
import type { TransferItem, ReceiveItem } from "../../types"

type DetailScreenRouteProp = RouteProp<
  {
    Detail: {
      item: TransferItem | ReceiveItem
    }
  },
  "Detail"
>

const DetailScreen = () => {
  const route = useRoute<DetailScreenRouteProp>()
  const navigation = useNavigation()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { item } = route.params

  const isTransferItem = "status" in item
  const isReceiver = user?.employee.name === (item as TransferItem).receiverDepartment

  const handleReceive = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      showToast({
        type: "success",
        message: "Muvaffaqiyatli qabul qilindi",
      })
      setIsLoading(false)
      navigation.goBack()
    }, 1500)
  }

  const renderDetailRow = (label: string, value: string | number, icon: React.ReactNode) => (
    <View style={styles.detailRow}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value.toString()}</Text>
    </View>
  )

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
            <Text style={styles.headerTitle}>
              {isTransferItem ? "Uzatma ma'lumotlari" : "Qabul qilish ma'lumotlari"}
            </Text>
            <Text style={styles.headerSubtitle}>ID: {item.id}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {item.journey && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Mahsulot yo'li</Text>
              <ItemJourney steps={item.journey} />
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Asosiy ma'lumotlar</Text>
            
            {renderDetailRow("Ism familya", item.fullName, 
              <User width={18} height={18} color="#5e72e4" />
            )}
            
            {renderDetailRow("Yuboruvchi bo'lim", item.senderDepartment, 
              <FileText width={18} height={18} color="#5e72e4" />
            )}
            
            {renderDetailRow("Qabul qiluvchi bo'lim", item.receiverDepartment, 
              <FileText width={18} height={18} color="#5e72e4" />
            )}

            {isTransferItem ? (
              <>
                {renderDetailRow("Yuborilgan sana", (item as TransferItem).sendDate, 
                  <Calendar width={18} height={18} color="#5e72e4" />
                )}
                {renderDetailRow("Yuborilgan vaqt", (item as TransferItem).sendTime, 
                  <Calendar width={18} height={18} color="#5e72e4" />
                )}
              </>
            ) : (
              <>
                {renderDetailRow("Qabul qilingan sana", (item as ReceiveItem).receiveDate, 
                  <Calendar width={18} height={18} color="#5e72e4" />
                )}
                {renderDetailRow("Qabul qilingan vaqt", (item as ReceiveItem).receiveTime, 
                  <Calendar width={18} height={18} color="#5e72e4" />
                )}
              </>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Mahsulot ma'lumotlari</Text>
            
            {renderDetailRow("Model", item.model, 
              <Package width={18} height={18} color="#5e72e4" />
            )}
            
            {renderDetailRow("Mato turi", item.materialType, 
              <Layers width={18} height={18} color="#5e72e4" />
            )}
            
            {renderDetailRow("Rangi", item.color, 
              <View style={[styles.colorDot, { backgroundColor: getColorCode(item.color) }]} />
            )}
            
            {renderDetailRow("O'lchami", item.size, 
              <Text style={styles.sizeText}>{item.size}</Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Miqdor ma'lumotlari</Text>
            
            {isTransferItem ? (
              <>
                {renderDetailRow("Umumiy soni", (item as TransferItem).totalCount, 
                  <Text style={styles.countText}>Σ</Text>
                )}
                
                {renderDetailRow("Qabul qilingan soni", (item as TransferItem).receivedCount, 
                  <Text style={[styles.countText, { color: "#2dce89" }]}>✓</Text>
                )}
                
                {renderDetailRow("Qolgan soni", 
                  (item as TransferItem).totalCount - (item as TransferItem).receivedCount, 
                  <Text style={[styles.countText, { color: "#fb6340" }]}>Δ</Text>
                )}
              </>
            ) : (
              <>
                {renderDetailRow("Yuborilgan soni", (item as ReceiveItem).sentCount, 
                  <Text style={styles.countText}>Σ</Text>
                )}
                
                {renderDetailRow("Qabul qilingan soni", (item as ReceiveItem).receivedCount, 
                  <Text style={[styles.countText, { color: "#2dce89" }]}>✓</Text>
                )}
                
                {renderDetailRow("Farq", (item as ReceiveItem).difference, 
                  <Text style={[styles.countText, { color: "#fb6340" }]}>Δ</Text>
                )}
              </>
            )}
          </View>

          {item.additionalNotes && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Qo'shimcha izoh</Text>
              <Text style={styles.notes}>{item.additionalNotes}</Text>
            </View>
          )}

          {isTransferItem && isReceiver && (item as TransferItem).receivedCount < (item as TransferItem).totalCount && (
            <TouchableOpacity 
              style={styles.receiveButton} 
              onPress={handleReceive} 
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.receiveButtonText}>Qabul qilish</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fe",
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
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
  detailRow: {
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
  detailLabel: {
    fontSize: 15,
    color: "#8898aa",
    flex: 1,
  },
  detailValue: {
    fontSize: 15,
    color: "#32325d",
    fontWeight: "600",
    textAlign: "right",
  },
  colorDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  sizeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#5e72e4",
  },
  countText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5e72e4",
  },
  notes: {
    fontSize: 15,
    color: "#32325d",
    lineHeight: 24,
    backgroundColor: "rgba(94, 114, 228, 0.05)",
    padding: 16,
    borderRadius: 12,
  },
  receiveButton: {
    backgroundColor: "#5e72e4",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 30,
    shadowColor: "#5e72e4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  receiveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default DetailScreen