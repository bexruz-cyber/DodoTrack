import React from "react"
import { FlatList, ActivityIndicator, StyleSheet, RefreshControl, View, Text } from "react-native"
import ListItem from "./ListItem"

interface Employee {
  id: string
  login: string
  department: {
    id: string,
    name: string
  }
  departmentId: string
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
      data={employees}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ListItem
          title={item.login}
          subtitle={item.department.name}
          onEdit={() => onEdit(item.id)}
          onDelete={() => onDelete(item.id)}
        />
      )}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Xodimlar mavjud emas</Text>
        <Text style={styles.emptySubtext}>Yangi xodim qo'shish uchun + tugmasini bosing</Text>
      </View>
      }
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
    paddingTop: 20
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30
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
    paddingTop: 30,
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