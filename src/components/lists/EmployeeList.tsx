import React from "react"
import { FlatList, ActivityIndicator, StyleSheet, RefreshControl, View, Text } from "react-native"
import ListItem from "./ListItem"

interface Employee {
  id: string
  login: string
  type: string
  createdAt: string
  updatedAt: string
}

interface EmployeeListProps {
  employees: Employee[]
  loading: boolean
  refreshing: boolean
  onRefresh: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const EmployeeList = ({ employees, loading, refreshing, onRefresh, onEdit, onDelete }: EmployeeListProps) => {
  if (loading && employees.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color="#5e72e4" size="large" />
        <Text style={styles.loaderText}>Ma'lumotlar yuklanmoqda...</Text>
      </View>
    )
  }

  if (employees.length === 0 && !loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Xodimlar mavjud emas</Text>
        <Text style={styles.emptySubtext}>Yangi xodim qo'shish uchun + tugmasini bosing</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={employees}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ListItem
          title={item.login}
          subtitle={item.type}
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: "#8898aa",
  },
  emptyContainer: {
    flex: 1,
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

export default EmployeeList