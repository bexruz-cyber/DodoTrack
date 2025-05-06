import React from "react"
import { FlatList, StyleSheet, RefreshControl, View, Text, ActivityIndicator } from "react-native"
import ListItem from "./ListItem"

interface DepartmentListProps {
  departments: string[]
  refreshing: boolean
  onRefresh: () => void
  onEdit: (index: number) => void
  onDelete: (index: number) => void
  loading?: boolean
}

const DepartmentList = ({ departments, refreshing, onRefresh, onEdit, onDelete, loading = false }: DepartmentListProps) => {
  if (loading && departments.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color="#5e72e4" size="large" />
        <Text style={styles.loaderText}>Ma'lumotlar yuklanmoqda...</Text>
      </View>
    )
  }

  if (departments.length === 0 && !loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Bo'limlar mavjud emas</Text>
        <Text style={styles.emptySubtext}>Yangi bo'lim qo'shish uchun + tugmasini bosing</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={departments}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item, index }) => (
        <ListItem
          title={item}
          onEdit={() => onEdit(index)}
          onDelete={() => onDelete(index)}
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
    backgroundColor: "#f8f9fe",
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
    backgroundColor: "#f8f9fe",
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