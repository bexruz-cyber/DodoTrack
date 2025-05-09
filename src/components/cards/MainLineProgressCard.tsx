// MainLineProgressCard.tsx
import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { ArrowRight, Package, Clock, CheckCircle, AlertCircle } from "react-native-feather"

type LineItem = {
  id: string
  protsessIsOver: boolean
  departmentId: string
  department: string
  createdAt: string
  updatedAt: string
  mainProtsessId: string
  umumiySoni: number
  qabulQiluvchiBolim: string
  model: string
  qoshilganlarSoni: number
  yuborilganlarSoni: number[]
  status: string[]
  qoshimchaMalumotlar: string
}

type MainLineProgressItem = {
  id: string
  modelName: string
  protsesIsOver: boolean
  protsesIsStartedTime: string
  protsesIsOverTime: string
  line: LineItem[]
}

type RootStackParamList = {
  Detail: { departmentId: string, mainProtsessId: string }
}

type MainLineProgressCardNavigationProp = NativeStackNavigationProp<RootStackParamList, "Detail">

interface MainLineProgressCardProps {
  item: MainLineProgressItem
  onTransfer: (item: MainLineProgressItem, lineItem: LineItem) => void
}

const MainLineProgressCard: React.FC<MainLineProgressCardProps> = ({ item, onTransfer }) => {
  const navigation = useNavigation<MainLineProgressCardNavigationProp>()
  
  // Get the current active line item (usually the last one)
  const currentLineItem = item.line[item.line.length - 1]
  
  // Calculate progress percentage
  const totalSent = currentLineItem.yuborilganlarSoni.reduce((sum, val) => sum + val, 0)
  const percentage = currentLineItem.umumiySoni > 0 
    ? Math.round((totalSent / currentLineItem.umumiySoni) * 100) 
    : 0

  const getStatusColor = () => {
    if (percentage === 100) return "#2dce89"
    if (percentage >= 50) return "#fb6340"
    return "#f5365c"
  }

  const getStatusIcon = () => {
    if (currentLineItem.protsessIsOver) return <CheckCircle width={16} height={16} color="#2dce89" />
    if (percentage > 0) return <Clock width={16} height={16} color="#fb6340" />
    return <AlertCircle width={16} height={16} color="#f5365c" />
  }

  const getStatusText = () => {
    if (currentLineItem.protsessIsOver) return "Yakunlangan"
    if (percentage > 0) return "Qisman"
    return "Kutilmoqda"
  }

  const getStatusBgColor = () => {
    if (currentLineItem.protsessIsOver) return "rgba(45, 206, 137, 0.1)"
    if (percentage > 0) return "rgba(251, 99, 64, 0.1)"
    return "rgba(245, 54, 92, 0.1)"
  }

  const getStatusTextColor = () => {
    if (currentLineItem.protsessIsOver) return "#2dce89"
    if (percentage > 0) return "#fb6340"
    return "#f5365c"
  }

  const handleTransfer = () => {
    onTransfer(item, currentLineItem)
  }

  const handleNavigateToDetail = () => {
    navigation.navigate("Detail", { 
      departmentId: currentLineItem.departmentId,
      mainProtsessId: currentLineItem.mainProtsessId
    })
  }

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.card}
        onPress={handleNavigateToDetail}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.departmentContainer}>
            <View style={[styles.departmentBadge, { backgroundColor: "#5e72e4" }]}>
              <Text style={styles.departmentBadgeText}>{currentLineItem.department}</Text>
            </View>
            <ArrowRight width={16} height={16} color="#8898aa" style={styles.arrow} />
            <View style={[styles.departmentBadge, { backgroundColor: "#2dce89" }]}>
              <Text style={styles.departmentBadgeText}>{currentLineItem.qabulQiluvchiBolim}</Text>
            </View>
          </View>
          <Text style={styles.id}>ID: {item.id.substring(0, 8)}</Text>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.iconNameContainer}>
            <View style={styles.iconContainer}>
              <Package width={18} height={18} color="#5e72e4" />
            </View>
            <Text style={styles.name}>{item.modelName}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailsRow}>
              <Text style={styles.detailText}>Model: {currentLineItem.model}</Text>
              <Text style={styles.detailText}>Sana: {formatDate(currentLineItem.createdAt)}</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.detailText}>Bo'lim: {currentLineItem.department}</Text>
              <Text style={styles.detailText}>Status: {currentLineItem.status.join(", ")}</Text>
            </View>
          </View>

          <View style={styles.countContainer}>
            <View style={styles.countItem}>
              <Text style={styles.countValue}>{currentLineItem.umumiySoni}</Text>
              <Text style={styles.countLabel}>Umumiy</Text>
            </View>
            <View style={styles.countItem}>
              <Text style={styles.countValue}>{currentLineItem.qoshilganlarSoni}</Text>
              <Text style={styles.countLabel}>Qo'shilgan</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor() }]}>
              <View style={styles.statusIconContainer}>
                {getStatusIcon()}
              </View>
              <Text style={[styles.statusText, { color: getStatusTextColor() }]}>
                {getStatusText()}
              </Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${percentage}%`,
                    backgroundColor: getStatusColor(),
                  },
                ]}
              />
            </View>
            <View style={[styles.percentageBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.percentageText}>{percentage}%</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.transferButton}
        onPress={handleTransfer}
        activeOpacity={0.7}
      >
        <Text style={styles.transferButtonText}>Uzatish</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f8f9fe",
    borderBottomWidth: 1,
    borderBottomColor: "#e6e9f0",
  },
  departmentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  departmentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  departmentBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  arrow: {
    marginHorizontal: 6,
  },
  id: {
    fontSize: 12,
    color: "#8898aa",
    fontWeight: "500",
  },
  cardContent: {
    padding: 16,
  },
  iconNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(94, 114, 228, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#32325d",
  },
  detailsContainer: {
    backgroundColor: "#f8f9fe",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  detailsRow: {
    gap: 10
  },
  detailText: {
    fontSize: 14,
    color: "#666",
  },
  countContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  countItem: {
    alignItems: "center",
  },
  countValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#32325d",
    marginBottom: 4,
  },
  countLabel: {
    fontSize: 12,
    color: "#8898aa",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusIconContainer: {
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#e9ecef",
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 12,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  percentageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  percentageText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  transferButton: {
    backgroundColor: "#2dce89",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
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
})

export default MainLineProgressCard