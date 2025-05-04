"use client"

import type React from "react"
import { useState } from "react"
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
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import type { TransferItem, ReceiveItem } from "../types"

interface TransferModalProps {
  visible: boolean
  onClose: () => void
  onTransfer: (receiverDepartment: string, count: number, notes: string) => void
  item: TransferItem | ReceiveItem | null
}

const TransferModal: React.FC<TransferModalProps> = ({ visible, onClose, onTransfer, item }) => {
  const { user } = useAuth()
  const { showToast } = useToast()

  const [receiverDepartment, setReceiverDepartment] = useState("")
  const [count, setCount] = useState("")
  const [notes, setNotes] = useState("")

  // Mock data for departments
  const departments = ["Tikuv", "Ombor", "Bichish", "Qadoqlash"].filter(
    (dept) => dept !== user?.department
  )

  const handleSubmit = () => {
    if (!receiverDepartment) {
      showToast({
        type: "warning",
        message: "Qabul qiluvchi bo'limni tanlang",
      })
      return
    }

    if (!count) {
      showToast({
        type: "warning",
        message: "Uzatilayotgan sonini kiriting",
      })
      return
    }

    const transferCount = Number.parseInt(count)
    if (isNaN(transferCount) || transferCount <= 0) {
      showToast({
        type: "warning",
        message: "Noto'g'ri son kiritildi",
      })
      return
    }

    // Check if we have enough items to transfer
    if (item) {
      const availableCount = "totalCount" in item ? item.totalCount : item.receivedCount
      if (transferCount > availableCount) {
        showToast({
          type: "warning",
          message: "Uzatilayotgan son mavjud sondan ko'p bo'lishi mumkin emas",
        })
        return
      }
    }

    onTransfer(receiverDepartment, transferCount, notes)
    setReceiverDepartment("")
    setCount("")
    setNotes("")
  }

  if (!item) return null

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.title}>Uzatish</Text>
            <TouchableOpacity onPress={onClose}>
              <X width={24} height={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Model:</Text>
              <Text style={styles.infoValue}>{item.model}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mato turi:</Text>
              <Text style={styles.infoValue}>{item.materialType}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mavjud soni:</Text>
              <Text style={styles.infoValue}>
                {"totalCount" in item ? item.totalCount : item.receivedCount}
              </Text>
            </View>

            <Text style={styles.label}>Qabul qiluvchi bo'lim *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
              {departments.map((dept) => (
                <TouchableOpacity
                  key={dept}
                  style={[styles.option, receiverDepartment === dept && styles.selectedOption]}
                  onPress={() => setReceiverDepartment(dept)}
                >
                  <Text style={[styles.optionText, receiverDepartment === dept && styles.selectedOptionText]}>
                    {dept}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>Uzatilayotgan soni *</Text>
            <TextInput
              style={styles.input}
              placeholder="Uzatilayotgan sonini kiriting"
              keyboardType="numeric"
              value={count}
              onChangeText={setCount}
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
              <Text style={styles.submitButtonText}>Uzatish</Text>
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
  optionsContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedOption: {
    backgroundColor: "#3498db",
    borderColor: "#3498db",
  },
  optionText: {
    color: "#333",
  },
  selectedOptionText: {
    color: "white",
    fontWeight: "500",
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

export default TransferModal
