import React from "react"
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from "react-native"
import { X } from "react-native-feather"
import LinearGradient from "react-native-linear-gradient"

interface SimpleModalProps {
  modalType: "department" | "color" | "size" | null
  editingId: string | null
  newDepartment: string
  setNewDepartment: React.Dispatch<React.SetStateAction<string>>
  newColor: string
  setNewColor: React.Dispatch<React.SetStateAction<string>>
  newSize: string
  setNewSize: React.Dispatch<React.SetStateAction<string>>
  onSaveDepartment: () => void
  onSaveColor: () => void
  onSaveSize: () => void
  onClose: () => void
  loading: boolean
}

const SimpleModal = ({
  modalType,
  editingId,
  newDepartment,
  setNewDepartment,
  newColor,
  setNewColor,
  newSize,
  setNewSize,
  onSaveDepartment,
  onSaveColor,
  onSaveSize,
  onClose,
  loading,
}: SimpleModalProps) => {
  let title = ""
  let placeholder = ""
  let value = ""
  let onChangeText = (text: string) => {}
  let onSave = () => {}

  if (modalType === "department") {
    title = editingId ? "Bo'limni tahrirlash" : "Yangi bo'lim qo'shish"
    placeholder = "Bo'lim nomini kiriting"
    value = newDepartment
    onChangeText = setNewDepartment
    onSave = onSaveDepartment
  } else if (modalType === "color") {
    title = editingId ? "Rangni tahrirlash" : "Yangi rang qo'shish"
    placeholder = "Rang nomini kiriting"
    value = newColor
    onChangeText = setNewColor
    onSave = onSaveColor
  } else if (modalType === "size") {
    title = editingId ? "O'lchamni tahrirlash" : "Yangi o'lcham qo'shish"
    placeholder = "O'lcham nomini kiriting"
    value = newSize
    onChangeText = setNewSize
    onSave = onSaveSize
  }

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <LinearGradient
          colors={['#5e72e4', '#324cdd']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.modalHeader}
        >
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
            activeOpacity={0.7}
          >
            <X width={20} height={20} color="white" />
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.modalForm}>
          <TextInput 
            style={styles.input} 
            placeholder={placeholder} 
            value={value} 
            onChangeText={onChangeText}
            placeholderTextColor="#8898aa"
          />
        </View>

        <View style={styles.modalActions}>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={onClose}
            activeOpacity={0.7}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Bekor qilish</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={onSave}
            activeOpacity={0.7}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>Saqlash</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(50, 50, 93, 0.4)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    width: "100%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalForm: {
    padding: 16,
  },
  input: {
    backgroundColor: "#f8f9fe",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#32325d",
    borderWidth: 1,
    borderColor: "#e6e9f0",
  },
  modalActions: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e6e9f0",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f8f9fe",
    padding: 14,
    borderRadius: 12,
    marginRight: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e6e9f0",
  },
  cancelButtonText: {
    color: "#525f7f",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#2dce89",
    padding: 14,
    borderRadius: 12,
    marginLeft: 8,
    alignItems: "center",
    shadowColor: "#2dce89",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default SimpleModal