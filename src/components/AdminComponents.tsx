import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native"
import { Edit, Trash } from "react-native-feather"
import type { User as UserType, Department, Color, Size } from "../types"

interface UserItemProps {
  item: UserType
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export const UserItem: React.FC<UserItemProps> = ({ item, onEdit, onDelete }) => {
  return (
    <View style={styles.listItem}>
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle}>{item.fullName}</Text>
        <Text style={styles.listItemSubtitle}>
          {item.department} | {item.role === "admin" ? "Administrator" : "Foydalanuvchi"}
        </Text>
      </View>
      <View style={styles.listItemActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(item.id)}>
          <Edit width={18} height={18} color="#3498db" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => onDelete(item.id)}>
          <Trash width={18} height={18} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

interface SimpleItemProps {
  item: Department | Color | Size
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export const SimpleItem: React.FC<SimpleItemProps> = ({ item, onEdit, onDelete }) => {
  return (
    <View style={styles.listItem}>
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle}>{item.name}</Text>
      </View>
      <View style={styles.listItemActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(item.id)}>
          <Edit width={18} height={18} color="#3498db" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => onDelete(item.id)}>
          <Trash width={18} height={18} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

interface UserListProps {
  users: UserType[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export const UserList: React.FC<UserListProps> = ({ users, onEdit, onDelete }) => {
  return (
    <FlatList
      data={users}
      renderItem={({ item }) => <UserItem item={item} onEdit={onEdit} onDelete={onDelete} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
    />
  )
}

interface SimpleListProps {
  data: (Department | Color | Size)[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export const SimpleList: React.FC<SimpleListProps> = ({ data, onEdit, onDelete }) => {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <SimpleItem item={item} onEdit={onEdit} onDelete={onDelete} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
    />
  )
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  listItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  listItemSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  listItemActions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
})
