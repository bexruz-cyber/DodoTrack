import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Edit2, Trash2 } from "react-native-feather"

interface ListItemProps {
  title: string
  subtitle?: string
  onEdit: () => void
  onDelete: () => void
}

const ListItem = ({ title, subtitle, onEdit, onDelete }: ListItemProps) => {
  return (
    <View style={styles.listItem}>
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle}>{title}</Text>
        {subtitle && (
          <View style={styles.subtitleContainer}>
            <View style={styles.subtitleBadge}>
              <Text style={styles.subtitleText}>{subtitle}</Text>
            </View>
          </View>
        )}
      </View>
      <View style={styles.listItemActions}>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={onEdit}
          activeOpacity={0.7}
        >
          <Edit2 width={16} height={16} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={onDelete}
          activeOpacity={0.7}
        >
          <Trash2 width={16} height={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#32325d",
    marginBottom: 4,
  },
  subtitleContainer: {
    flexDirection: "row",
  },
  subtitleBadge: {
    backgroundColor: "rgba(94, 114, 228, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subtitleText: {
    fontSize: 12,
    color: "#5e72e4",
    fontWeight: "500",
  },
  listItemActions: {
    flexDirection: "row",
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#5e72e4",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    shadowColor: "#5e72e4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5365c",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    shadowColor: "#f5365c",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
})

export default ListItem