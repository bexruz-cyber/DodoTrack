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
import { X, Package } from "react-native-feather"
import { useToast } from "../../context/ToastContext"
import type { TransferItem } from "../../types"
import LinearGradient from "react-native-linear-gradient"

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
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.centeredView}>
        <View style={styles.modalView}>
          <LinearGradient
            colors={['#5e72e4', '#324cdd']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <View style={styles.iconContainer}>
                <Package width={24} height={24} color="white" />
              </View>
              <Text style={styles.title}>Qabul qilish</Text>
            </View>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
              activeOpacity={0.7}
            >
              <X width={20} height={20} color="white" />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView style={styles.formContainer}>
            <View style={styles.infoCard}>
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
            </View>

            <View style={styles.countCard}>
              <View style={styles.countRow}>
                <View style={styles.countItem}>
                  <Text style={styles.countValue}>100</Text>
                  <Text style={styles.countLabel}>Umumiy soni</Text>
                </View>
                <View style={styles.countItem}>
                  <Text style={styles.countValue}>{item.receivedCount}</Text>
                  <Text style={styles.countLabel}>Qabul qilingan</Text>
                </View>
                <View style={styles.countItem}>
                  <Text style={[styles.countValue, { color: "#f5365c" }]}>20</Text>
                  <Text style={styles.countLabel}>Qolgan soni</Text>
                </View>
              </View>
            </View>

            <Text style={styles.label}>Qabul qilingan soni <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Qabul qilingan sonini kiriting"
              keyboardType="numeric"
              value={receivedCount}
              onChangeText={setReceivedCount}
              placeholderTextColor="#8898aa"
            />

            <Text style={styles.label}>Qo'shimcha izoh</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Qo'shimcha izoh kiriting"
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
              placeholderTextColor="#8898aa"
              textAlignVertical="top"
            />
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Bekor qilish</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmit}
              activeOpacity={0.7}
            >
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
    backgroundColor: "rgba(50, 50, 93, 0.4)",
    padding: 20,
  },
  modalView: {
    width: "100%",
    maxHeight: "90%",
    backgroundColor: "white",
    borderRadius: 16,
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
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  title: {
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
  formContainer: {
    padding: 16,
    maxHeight: "70%",
  },
  infoCard: {
    backgroundColor: "#f8f9fe",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e6e9f0",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e9f0",
  },
  infoLabel: {
    fontSize: 14,
    color: "#8898aa",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#32325d",
    fontWeight: "600",
  },
  countCard: {
    backgroundColor: "#f8f9fe",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e6e9f0",
  },
  countRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  countItem: {
    alignItems: "center",
  },
  countValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5e72e4",
    marginBottom: 4,
  },
  countLabel: {
    fontSize: 12,
    color: "#8898aa",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#525f7f",
    marginBottom: 8,
    marginTop: 16,
  },
  required: {
    color: "#f5365c",
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
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  buttonContainer: {
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
  submitButton: {
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
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default ReceiveModal