"use client"

import type React from "react"
import { useEffect, useState } from "react"
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
  ActivityIndicator,
} from "react-native"
import { X, Package } from "react-native-feather"
import { useAuth } from "../../context/AuthContext"
import { useToast } from "../../context/ToastContext"
import LinearGradient from "react-native-linear-gradient"
import { useAppData } from "../../api/categoryData"
import { axiosInstance } from "../../api/axios"

interface AddTransferModalProps {
  visible: boolean
  onClose: () => void
}

const AddStockModal: React.FC<AddTransferModalProps> = ({ visible, onClose,  }) => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { refetchAll, colors, sizes, loading, } = useAppData()

  useEffect(() => {
    const getData = async() => {
      await refetchAll()
    }
    getData()
  }, [visible])
  

  const [formData, setFormData] = useState({
    receiverDepartment: "",
    receiverDepartmentId: "",
    model: "",
    materialType: "",
    totalCount: "",
    color: "",
    colorId: "",
    size: "",
    sizeId: "",
    additionalNotes: "",
  })

  const handleSubmit = async () => {
    if (!formData.model || !formData.materialType || !formData.totalCount) {
      showToast({
        type: "warning",
        message: "Barcha majburiy maydonlarni to'ldiring",
      })
      return
    }

    try {
      setIsSubmitting(true)

      
      const response = await axiosInstance.post("/api/mainLineProgress", {
        userName: user?.username || "Nomalum foydalanuvchi",
        userId: user?.id,
        yuboruvchiBolimId: user?.department.id || "",
        qabulQiluvchiBolimId: user?.department.id,
        model: formData.model,
        MatoTuri: formData.materialType,
        umumiySoni: Number.parseInt(formData.totalCount),
        rangId: formData.colorId,
        olchamId: formData.sizeId,
        qoshimchaIzoh: formData.additionalNotes,
      })

      console.log("yuborilgan malumot modal:", response.data);
      showToast({
        type: "success",
        message: "Muvaffaqiyatli qo'shildi",
      })

      // Reset form
      setFormData({
        receiverDepartment: "",
        receiverDepartmentId: "",
        model: "",
        materialType: "",
        totalCount: "",
        color: "",
        colorId: "",
        size: "",
        sizeId: "",
        additionalNotes: "",
      })

      onClose()
    } catch (error: any) {
      console.log("Error submitting transfer:", error)
      showToast({
        type: "error",
        message: "Xatolik yuz berdi. Qayta urinib ko'ring.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle color selection
  const handleColorSelect = (color: any) => {
    const colorName = typeof color.name === "string" ? color.name : JSON.stringify(color.name)

    setFormData({
      ...formData,
      color: colorName,
      colorId: color.id,
    })
  }

  // Handle size selection
  const handleSizeSelect = (size: any) => {
    const sizeName = typeof size.name === "string" ? size.name : JSON.stringify(size.name)

    setFormData({
      ...formData,
      size: sizeName,
      sizeId: size.id,
    })
  }

  if (loading) {
    return (
      <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, styles.loadingContainer]}>
            <ActivityIndicator size="large" color="#5e72e4" />
            <Text style={styles.loadingText}>Ma'lumotlar yuklanmoqda...</Text>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.centeredView}>
        <View style={styles.modalView}>
          <LinearGradient
            colors={["#5e72e4", "#324cdd"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <View style={styles.iconContainer}>
                <Package width={24} height={24} color="white" />
              </View>
              <Text style={styles.title}>Yangi uzatma qo'shish</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
              <X width={20} height={20} color="white" />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView style={styles.formContainer}>
            <Text style={styles.label}>
              Model <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Modelni kiriting"
              value={formData.model}
              onChangeText={(text) => setFormData({ ...formData, model: text })}
              placeholderTextColor="#8898aa"
            />

            <Text style={styles.label}>
              Mato turi <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Mato turini kiriting"
              value={formData.materialType}
              onChangeText={(text) => setFormData({ ...formData, materialType: text })}
              placeholderTextColor="#8898aa"
            />

            <Text style={styles.label}>Rangi</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color.id}
                  style={[styles.option, formData.colorId === color.id && styles.selectedOption]}
                  onPress={() => handleColorSelect(color)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.optionText, formData.colorId === color.id && styles.selectedOptionText]}>
                    {typeof color.name === "string" ? color.name : JSON.stringify(color.name)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>O'lchami</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
              {sizes.map((size) => (
                <TouchableOpacity
                  key={size.id}
                  style={[styles.option, formData.sizeId === size.id && styles.selectedOption]}
                  onPress={() => handleSizeSelect(size)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.optionText, formData.sizeId === size.id && styles.selectedOptionText]}>
                    {typeof size.name === "string" ? size.name : JSON.stringify(size.name)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>
              Umumiy soni <Text style={styles.required}>*</Text>
            </Text>
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
            <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.7} disabled={isSubmitting}>
              <Text style={styles.cancelButtonText}>Bekor qilish</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              activeOpacity={0.7}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Qo'shish</Text>
              )}
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
    maxHeight: "70%",
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
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#525f7f",
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
    flexGrow: 1,
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
    marginBottom: 50,
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

export default AddStockModal
