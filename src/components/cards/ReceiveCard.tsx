import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { ReceiveItem } from "../../types"

type RootStackParamList = {
  Detail: { item: ReceiveItem }
}

type ReceiveCardNavigationProp = NativeStackNavigationProp<RootStackParamList, "Detail">

interface ReceiveCardProps {
  item: ReceiveItem
}

const ReceiveCard: React.FC<ReceiveCardProps> = ({ item }) => {
  const navigation = useNavigation<ReceiveCardNavigationProp>()
  const percentage = Math.round((item.receivedCount / item.sentCount) * 100)

  const getStatusColor = () => {
    if (percentage === 100) return "#2ecc71"
    if (percentage >= 50) return "#f39c12"
    return "#e74c3c"
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("Detail", { item })}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.departmentContainer}>
          <View style={[styles.departmentBadge, { backgroundColor: "#3498db" }]}>
            <Text style={styles.departmentBadgeText}>{item.senderDepartment}</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
          <View style={[styles.departmentBadge, { backgroundColor: "#2ecc71" }]}>
            <Text style={styles.departmentBadgeText}>{item.receiverDepartment}</Text>
          </View>
        </View>
        <Text style={styles.id}>ID: {item.id.substring(0, 8)}</Text>
      </View>

      <Text style={styles.name}>{item.fullName}</Text>
      <View style={styles.detailsRow}>
        <Text style={styles.detailText}>Model: {item.model}</Text>
        <Text style={styles.detailText}>Mato: {item.materialType}</Text>
      </View>
      <View style={styles.detailsRow}>
        <Text style={styles.detailText}>Rang: {item.color}</Text>
        <Text style={styles.detailText}>O'lcham: {item.size}</Text>
      </View>

      <View style={styles.countContainer}>
        <Text style={styles.count}>Yuborilgan: {item.sentCount}</Text>
        <Text style={styles.count}>Qabul: {item.receivedCount}</Text>
        <Text style={[styles.count, { color: item.difference > 0 ? "#e74c3c" : "#2ecc71" }]}>
          Farq: {item.difference}
        </Text>
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
        <Text style={[styles.percentage, { color: getStatusColor() }]}>{percentage}%</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
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
    fontSize: 14,
    color: "#666",
  },
  id: {
    fontSize: 12,
    color: "#95a5a6",
    fontWeight: "500",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
  },
  countContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  count: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  percentage: {
    fontSize: 14,
    fontWeight: "bold",
    width: 40,
    textAlign: "right",
  },
})

export default ReceiveCard
