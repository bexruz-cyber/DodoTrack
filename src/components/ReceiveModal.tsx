import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { X } from "react-native-feather"
import { useToast } from "../context/ToastContext"
import type { TransferItem } from "../types"

interface ReceiveModalProps {
  visible: boolean
  onClose: () => void
  onReceive: (receivedCount: number, notes: string) => void
  item: TransferItem | null
}

const ReceiveModal: React.FC<ReceiveModalProps> = ({ visible, onClose, onReceive, item }) => {
  const { showToast } = useToast()
  const [receivedCount, setReceivedCount] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = () => {
    if (!receivedCount) {
      showToast({
        type: "warning",
        message: "Qabul qilingan sonini kiriting",
      })
      return
    }

    const count = parseInt(receivedCount)
    if (isNaN(count) || count <= 0) {
      showToast({
        type: "warning",
        message: "Noto'g'ri son kiritildi",
      })
      return
    }

    if (item && count > item.totalCount - item.receivedCount) {
      showToast({
        type: "warning",
        message: "Qabul qilingan son qolgan sondan ko'p bo'lishi mumkin emas",
      })
      return
    }

    onReceive(count, notes)
    setReceivedCount("")
    setNotes("")
  }

  if (!item) return null

  const remainingCount = item.totalCount - item.receivedCount

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.title}>Qabul qilish</Text>
            <TouchableOpacity onPress={onClose}>
              <X width={24} height={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Yuboruvchi:</Text>
              <Text style={styles.infoValue}>{item.fullName}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Bo'lim:</Text>
              <Text style={styles.infoValue}>{item.senderDepartment}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Model:</Text>
              <Text style={styles.infoValue}>{item.model}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mato turi:</Text>
              <Text style={styles.infoValue}>{item.materialType}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Umumiy soni:</Text>
              <Text style={styles.infoValue}>{item.totalCount}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Qabul qilingan:</Text>
              <Text style={styles.infoValue}>{item.receivedCount}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Qolgan soni:</Text>
              <Text style={styles.infoValue}>{remainingCount}</Text>
            </View>

            <Text style={styles.label}>Qabul qilingan soni *</Text>
            <TextInput
              style={styles.input}
              placeholder="Qabul qilingan sonini kiriting"
              keyboardType="numeric"
              value={receivedCount}
              onChangeText={setReceivedCount}
            />

            <Text style={styles.label}>Qo'shimcha izoh</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Qo'shimcha izoh kiriting"
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
            />
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Bekor qilish</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Qabul qilish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  formContainer: {
    maxHeight: "70%",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  submitButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#3498db",
    marginLeft: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "500",
  },
})

export default ReceiveModal
