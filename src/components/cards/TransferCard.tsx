import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { ArrowRight, Package, CheckCircle, Clock, AlertCircle } from "react-native-feather"
import { Product } from "../../types/apiType"

type RootStackParamList = {
  Detail: { item: Product }
}

type TransferCardNavigationProp = NativeStackNavigationProp<RootStackParamList, "Detail">

interface TransferCardProps {
  item: Product
}

const TransferCard: React.FC<TransferCardProps> = ({ item }) => {
  const navigation = useNavigation<TransferCardNavigationProp>()

  // Calculate percentage based on available data
  const percentage = Math.round((item.qoshilganlarSoni / item.umumiySoni) * 100) || 0

  const getStatusColor = () => {
    if (percentage === 100) return "#2dce89"
    if (percentage >= 50) return "#fb6340"
    return "#f5365c"
  }

  const getStatusIcon = () => {
    const status = item.status?.[0]?.status || "pending"
    if (status === "Completed") return <CheckCircle width={16} height={16} color="#2dce89" />
    if (status === "InProgress") return <Clock width={16} height={16} color="#fb6340" />
    return <AlertCircle width={16} height={16} color="#f5365c" />
  }

  const getStatusText = () => {
    const status = item.status?.[0]?.status || "pending"
    if (status === "Completed") return "Yakunlangan"
    if (status === "InProgress") return "Qisman"
    return "Kutilmoqda"
  }

  const getStatusBgColor = () => {
    const status = item.status?.[0]?.status || "pending"
    if (status === "Completed") return "rgba(45, 206, 137, 0.1)"
    if (status === "InProgress") return "rgba(251, 99, 64, 0.1)"
    return "rgba(245, 54, 92, 0.1)"
  }

  const getStatusTextColor = () => {
    const status = item.status?.[0]?.status || "pending"
    if (status === "Completed") return "#2dce89"
    if (status === "InProgress") return "#fb6340"
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
            <Text style={styles.departmentBadgeText}>{item.department}</Text>
          </View>
          <ArrowRight width={16} height={16} color="#8898aa" style={styles.arrow} />
          <View style={[styles.departmentBadge, { backgroundColor: "#2dce89" }]}>
            <Text style={styles.departmentBadgeText}>{item.qabulQiluvchiBolim}</Text>
          </View>
        </View>
        <Text style={styles.id}>{item.protsessIsOver ? 'Jarayon tugagan' : 'Jarayon davom etmoqda'}</Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.countContainer}>
          <View style={styles.iconNameContainer}>
            <View style={styles.iconContainer}>
              <Package width={18} height={18} color="#5e72e4" />
            </View>
            <Text style={styles.name}>{item.model}</Text>
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

        <View style={styles.detailsContainer}>

          <View style={styles.detailsRow}>
            <Text style={styles.detailText}>
              Rang: {item.color?.[0]?.name || "Mavjud emas"}
            </Text>
            <Text style={styles.detailText}>
              O'lcham: {item.size?.[0]?.name || "Mavjud emas"}
            </Text>
          </View>
        </View>

        <View style={styles.countContainer}>
          <View style={styles.countItem}>
            <Text style={styles.countValue}>{item.umumiySoni}</Text>
            <Text style={styles.countLabel}>Umumiy</Text>
          </View>
          <View style={styles.countItem}>
            <Text style={styles.countValue}>{item.yuborilganlarSoni}</Text>
            <Text style={styles.countLabel}>Yuborilgan</Text>
          </View>

          <View style={styles.countItem}>
            <Text style={styles.countValue}>{item.yaroqsizlarSoni[1].soni}</Text>
            <Text style={styles.countLabel}>Zarar</Text>
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
