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
import { X, Package } from "react-native-feather"
import { useAuth } from "../../context/AuthContext"
import { useToast } from "../../context/ToastContext"
import type { TransferItem, ReceiveItem } from "../../types"
import LinearGradient from "react-native-linear-gradient"

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
    (dept) => dept !== user?.department.name
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
              <Text style={styles.title}>Uzatish</Text>
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
            </View>

            <Text style={styles.label}>Qabul qiluvchi bo'lim <Text style={styles.required}>*</Text></Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
              {departments.map((dept) => (
                <TouchableOpacity
                  key={dept}
                  style={[styles.option, receiverDepartment === dept && styles.selectedOption]}
                  onPress={() => setReceiverDepartment(dept)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.optionText, receiverDepartment === dept && styles.selectedOptionText]}>
                    {dept}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>Uzatilayotgan soni <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Uzatilayotgan sonini kiriting"
              keyboardType="numeric"
              value={count}
              onChangeText={setCount}
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
  optionsContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#f8f9fe",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e6e9f0",
  },
  selectedOption: {
    backgroundColor: "#5e72e4",
    borderColor: "#5e72e4",
  },
  optionText: {
    color: "#525f7f",
    fontWeight: "500",
  },
  selectedOptionText: {
    color: "white",
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
    marginBottom: 50
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
    backgroundColor: "#fb6340",
    padding: 14,
    borderRadius: 12,
    marginLeft: 8,
    alignItems: "center",
    shadowColor: "#fb6340",
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

export default TransferModal