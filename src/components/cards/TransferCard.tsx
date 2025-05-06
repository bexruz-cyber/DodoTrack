import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { TransferItem } from "../../types"
import { ArrowRight, Package, CheckCircle, Clock, AlertCircle } from "react-native-feather"

type RootStackParamList = {
  Detail: { item: TransferItem }
}

type TransferCardNavigationProp = NativeStackNavigationProp<RootStackParamList, "Detail">

interface TransferCardProps {
  item: TransferItem
}

const TransferCard: React.FC<TransferCardProps> = ({ item }) => {
  const navigation = useNavigation<TransferCardNavigationProp>()
  const percentage = Math.round((item.receivedCount / item.totalCount) * 100)

  const getStatusColor = () => {
    if (percentage === 100) return "#2dce89"
    if (percentage >= 50) return "#fb6340"
    return "#f5365c"
  }

  const getStatusIcon = () => {
    if (item.status === "completed") return <CheckCircle width={16} height={16} color="#2dce89" />
    if (item.status === "partial") return <Clock width={16} height={16} color="#fb6340" />
    return <AlertCircle width={16} height={16} color="#f5365c" />
  }

  const getStatusText = () => {
    if (item.status === "completed") return "Yakunlangan"
    if (item.status === "partial") return "Qisman"
    return "Kutilmoqda"
  }

  const getStatusBgColor = () => {
    if (item.status === "completed") return "rgba(45, 206, 137, 0.1)"
    if (item.status === "partial") return "rgba(251, 99, 64, 0.1)"
    return "rgba(245, 54, 92, 0.1)"
  }

  const getStatusTextColor = () => {
    if (item.status === "completed") return "#2dce89"
    if (item.status === "partial") return "#fb6340"
    return "#f5365c"
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("Detail", { item })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.departmentContainer}>
          <View style={[styles.departmentBadge, { backgroundColor: "#5e72e4" }]}>
            <Text style={styles.departmentBadgeText}>{item.senderDepartment}</Text>
          </View>
          <ArrowRight width={16} height={16} color="#8898aa" style={styles.arrow} />
          <View style={[styles.departmentBadge, { backgroundColor: "#2dce89" }]}>
            <Text style={styles.departmentBadgeText}>{item.receiverDepartment}</Text>
          </View>
        </View>
        <Text style={styles.id}>ID: {item.id.substring(0, 8)}</Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.iconNameContainer}>
          <View style={styles.iconContainer}>
            <Package width={18} height={18} color="#5e72e4" />
          </View>
          <Text style={styles.name}>{item.fullName}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailsRow}>
            <Text style={styles.detailText}>Model: {item.model}</Text>
            <Text style={styles.detailText}>Mato: {item.materialType}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailText}>Rang: {item.color}</Text>
            <Text style={styles.detailText}>O'lcham: {item.size}</Text>
          </View>
        </View>

        <View style={styles.countContainer}>
          <View style={styles.countItem}>
            <Text style={styles.countValue}>{item.totalCount}</Text>
            <Text style={styles.countLabel}>Umumiy</Text>
          </View>
          <View style={styles.countItem}>
            <Text style={styles.countValue}>{item.receivedCount}</Text>
            <Text style={styles.countLabel}>Qabul</Text>
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
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
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
  detailLabel: {
    fontSize: 14,
    color: "#8898aa",
    width: 70,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    color: "#525f7f",
    fontWeight: "500",
    flex: 1,
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
})

export default TransferCard