import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { TransferItem } from "../types"

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
    if (percentage === 100) return "#4CAF50"
    if (percentage >= 50) return "#FFC107"
    return "#F44336"
  }

  return (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Detail", { item })}>
      <View style={styles.header}>
        <Text style={styles.department}>{item.senderDepartment}</Text>
        <Text style={styles.id}>ID: {item.id}</Text>
      </View>

      <Text style={styles.name}>{item.fullName}</Text>
      <Text style={styles.receiver}>Qabul qiluvchi: {item.receiverDepartment}</Text>

      <View style={styles.countContainer}>
        <Text style={styles.count}>Umumiy soni: {item.totalCount}</Text>
        <Text style={styles.count}>Qabul qilingan: {item.receivedCount}</Text>
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
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  department: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3498db",
  },
  id: {
    fontSize: 12,
    color: "#95a5a6",
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  receiver: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  countContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  count: {
    fontSize: 14,
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

export default TransferCard
