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
        >
          <Text style={[styles.optionText, formData[field] === option && styles.selectedOptionText]}>{option}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.title}>Yangi uzatma qo'shish</Text>
            <TouchableOpacity onPress={onClose}>
              <X width={24} height={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <Text style={styles.label}>Qabul qiluvchi bo'lim *</Text>
            {renderSelectOptions(departments, formData.receiverDepartment, "receiverDepartment")}

            <Text style={styles.label}>Model *</Text>
            {renderSelectOptions(models, formData.model, "model")}

            <Text style={styles.label}>Mato turi *</Text>
            {renderSelectOptions(materials, formData.materialType, "materialType")}

            <Text style={styles.label}>Rangi</Text>
            {renderSelectOptions(colors, formData.color, "color")}

            <Text style={styles.label}>O'lchami</Text>
            {renderSelectOptions(sizes, formData.size, "size")}

            <Text style={styles.label}>Umumiy soni *</Text>
            <TextInput
              style={styles.input}
              placeholder="Umumiy sonini kiriting"
              keyboardType="numeric"
              value={formData.totalCount}
              onChangeText={(text) => setFormData({ ...formData, totalCount: text })}
            />

            <Text style={styles.label}>Qo'shimcha izoh</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Qo'shimcha izoh kiriting"
              multiline
              numberOfLines={4}
              value={formData.additionalNotes}
              onChangeText={(text) => setFormData({ ...formData, additionalNotes: text })}
            />
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Bekor qilish</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
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
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
    marginTop: 12,
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

export default AddTransferModal
