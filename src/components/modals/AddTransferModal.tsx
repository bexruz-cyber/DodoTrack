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
import { X, Package } from "react-native-feather"
import { useAuth } from "../../context/AuthContext"
import { useToast } from "../../context/ToastContext"
import LinearGradient from "react-native-linear-gradient"

interface AddTransferModalProps {
  visible: boolean
  onClose: () => void
  onAdd: (item: any) => void
}

const AddTransferModal: React.FC<AddTransferModalProps> = ({ visible, onClose, onAdd }) => {
  const { user } = useAuth()
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    receiverDepartment: "",
    model: "",
    materialType: "",
    totalCount: "",
    color: "",
    size: "",
    additionalNotes: "",
  })

  // Mock data for dropdowns
  const departments = ["Tikuv", "Ombor", "Bichish", "Qadoqlash"]
  const models = ["Model A", "Model B", "Model C", "Model D"]
  const materials = ["Paxta", "Ipak", "Jun", "Sintetika"]
  const colors = ["Qora", "Oq", "Ko'k", "Qizil", "Yashil"]
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

  const handleSubmit = () => {
    if (!formData.receiverDepartment || !formData.model || !formData.materialType || !formData.totalCount) {
      showToast({
        type: "warning",
        message: "Barcha majburiy maydonlarni to'ldiring",
      })
      return
    }

    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: user?.fullName || "Nomalum foydalanuvchi",
      sendDate: new Date().toLocaleDateString(),
      sendTime: new Date().toLocaleTimeString(),
      senderDepartment: user?.department || "Nomalum bo'lim",
      receiverDepartment: formData.receiverDepartment,
      model: formData.model,
      materialType: formData.materialType,
      totalCount: Number.parseInt(formData.totalCount),
      receivedCount: 0,
      color: formData.color,
      size: formData.size,
      additionalNotes: formData.additionalNotes,
      status: "pending",
    }

    onAdd(newItem)
    showToast({
      type: "success",
      message: "Muvaffaqiyatli qo'shildi",
    })

    // Reset form
    setFormData({
      receiverDepartment: "",
      model: "",
      materialType: "",
      totalCount: "",
      color: "",
      size: "",
      additionalNotes: "",
    })

    onClose()
  }

  const renderSelectOptions = (options: string[], selectedValue: string, field: keyof typeof formData) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[styles.option, formData[field] === option && styles.selectedOption]}
          onPress={() => setFormData({ ...formData, [field]: option })}
          activeOpacity={0.7}
        >
          <Text style={[styles.optionText, formData[field] === option && styles.selectedOptionText]}>{option}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )

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
              <Text style={styles.title}>Yangi uzatma qo'shish</Text>
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
            <Text style={styles.label}>Qabul qiluvchi bo'lim <Text style={styles.required}>*</Text></Text>
            {renderSelectOptions(departments, formData.receiverDepartment, "receiverDepartment")}

            <Text style={styles.label}>Model <Text style={styles.required}>*</Text></Text>
            {renderSelectOptions(models, formData.model, "model")}

            <Text style={styles.label}>Mato turi <Text style={styles.required}>*</Text></Text>
            {renderSelectOptions(materials, formData.materialType, "materialType")}

            <Text style={styles.label}>Rangi</Text>
            {renderSelectOptions(colors, formData.color, "color")}

            <Text style={styles.label}>O'lchami</Text>
            {renderSelectOptions(sizes, formData.size, "size")}

            <Text style={styles.label}>Umumiy soni <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Umumiy sonini kiriting"
              keyboardType="numeric"
              value={formData.totalCount}
              onChangeText={(text) => setFormData({ ...formData, totalCount: text })}
              placeholderTextColor="#8898aa"
            />

            <Text style={styles.label}>Qo'shimcha izoh</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Qo'shimcha izoh kiriting"
              multiline
              numberOfLines={4}
              value={formData.additionalNotes}
              onChangeText={(text) => setFormData({ ...formData, additionalNotes: text })}
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
              <Text style={styles.submitButtonText}>Qo'shish</Text>
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
    backgroundColor: "#5e72e4",
    padding: 14,
    borderRadius: 12,
    marginLeft: 8,
    alignItems: "center",
    shadowColor: "#5e72e4",
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

export default AddTransferModal