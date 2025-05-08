import React from "react"
import { FlatList, StyleSheet, RefreshControl, View, Text, ActivityIndicator } from "react-native"
import ListItem from "./ListItem"
import { EmployeeType } from "../../types/apiType"


interface DepartmentListProps {
  departments: EmployeeType[],
  refreshing: boolean
  onRefresh: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  loading?: boolean
}

const DepartmentList = ({ departments, refreshing, onRefresh, onEdit, onDelete, loading }: DepartmentListProps) => {
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color="#5e72e4" size="large" />
        <Text style={styles.loaderText}>Ma'lumotlar yuklanmoqda...</Text>
      </View>
    )
  }


  return (
    <FlatList
      data={departments}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Bo'limlar mavjud emas</Text>
          <Text style={styles.emptySubtext}>Yangi bo'lim qo'shish uchun + tugmasini bosing</Text>
        </View>
      }
      renderItem={({ item }) => (
        <ListItem
          title={item.name}
          onEdit={() => onEdit(item.id)}
          onDelete={() => onDelete(item.id)}
        />
      )}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#5e72e4"]}
          tintColor="#5e72e4"
          progressBackgroundColor="#ffffff"
        />
      }
    />
  )
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: "#8898aa",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#32325d",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#8898aa",
    textAlign: "center",
  },
})

export default DepartmentList