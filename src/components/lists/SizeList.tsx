import React from "react"
import { FlatList, StyleSheet, RefreshControl, View, Text, ActivityIndicator } from "react-native"
import ListItem from "./ListItem"
import { Size } from "../../types/apiType"


interface SizeListProps {
  sizes: Size[]
  refreshing: boolean
  onRefresh: () => void
  onEdit: (index: string) => void
  onDelete: (index: string) => void
  loading?: boolean
}

const SizeList = ({ sizes, refreshing, onRefresh, onEdit, onDelete, loading = false }: SizeListProps) => {
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
      data={sizes}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>O'lchamlar mavjud emas</Text>
          <Text style={styles.emptySubtext}>Yangi o'lcham qo'shish uchun + tugmasini bosing</Text>
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

export default SizeList