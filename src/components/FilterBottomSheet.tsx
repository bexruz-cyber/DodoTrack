"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from "react-native"
import { X } from "react-native-feather"

interface FilterBottomSheetProps {
  onApplyFilter: (filters: any) => void
}

const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({ onApplyFilter }) => {
  const [modalVisible, setModalVisible] = useState(false)

  const [filters, setFilters] = useState({
    senderDepartment: "",
    receiverDepartment: "",
    model: "",
    materialType: "",
    color: "",
    size: "",
  })

  // Mock data for dropdowns
  const departments = ["Tikuv", "Ombor", "Bichish", "Qadoqlash"]
  const models = ["Model A", "Model B", "Model C", "Model D"]
  const materials = ["Paxta", "Ipak", "Jun", "Sintetika"]
  const colors = ["Qora", "Oq", "Ko'k", "Qizil", "Yashil"]
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

  const handlePresentModal = () => {
    setModalVisible(true)
  }

  const handleDismissModal = () => {
    setModalVisible(false)
  }

  const handleApplyFilter = () => {
    onApplyFilter(filters)
    handleDismissModal()
  }

  const handleResetFilter = () => {
    setFilters({
      senderDepartment: "",
      receiverDepartment: "",
      model: "",
      materialType: "",
      color: "",
      size: "",
    })
  }

  const renderSelectItem = (label: string, value: string, options: string[], field: keyof typeof filters) => (
    <View style={styles.selectContainer}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, filters[field] === option && styles.selectedOption]}
            onPress={() => setFilters({ ...filters, [field]: option })}
          >
            <Text style={[styles.optionText, filters[field] === option && styles.selectedOptionText]}>{option}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )

  return (
    <>
      <TouchableOpacity style={styles.filterButton} onPress={handlePresentModal}>
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={handleDismissModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Filtrlash</Text>
              <TouchableOpacity onPress={handleDismissModal}>
                <X width={24} height={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView}>
              {renderSelectItem("Yuboruvchi bo'lim", filters.senderDepartment, departments, "senderDepartment")}
              {renderSelectItem("Qabul qiluvchi bo'lim", filters.receiverDepartment, departments, "receiverDepartment")}
              {renderSelectItem("Model", filters.model, models, "model")}
              {renderSelectItem("Mato turi", filters.materialType, materials, "materialType")}
              {renderSelectItem("Rangi", filters.color, colors, "color")}
              {renderSelectItem("O'lchami", filters.size, sizes, "size")}
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.resetButton} onPress={handleResetFilter}>
                <Text style={styles.resetButtonText}>Tozalash</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilter}>
                <Text style={styles.applyButtonText}>Qo'llash</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  filterButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 10,
  },
  filterButtonText: {
    color: "white",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: "75%",
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
  scrollView: {
    maxHeight: "70%",
  },
  selectContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
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
  resetButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    marginRight: 8,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  applyButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#3498db",
    marginLeft: 8,
    alignItems: "center",
  },
  applyButtonText: {
    color: "white",
    fontWeight: "500",
  },
})

export default FilterBottomSheet
