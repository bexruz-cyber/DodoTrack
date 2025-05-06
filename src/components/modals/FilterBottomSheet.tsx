import React, { useCallback, useMemo, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { Filter, X } from "react-native-feather"
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet"
import LinearGradient from "react-native-linear-gradient"

interface FilterBottomSheetProps {
  onApplyFilter: (filters: any) => void
}

const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({ onApplyFilter }) => {
  const bottomSheetRef = useRef<BottomSheet>(null)

  const [filters, setFilters] = React.useState({
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

  // Snap points
  const snapPoints = useMemo(() => ["80%"], ["100%"])

  // Callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.expand()
  }, [])

  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close()
  }, [])

  const handleApplyFilter = useCallback(() => {
    onApplyFilter(filters)
    bottomSheetRef.current?.close()
  }, [filters, onApplyFilter])

  const handleResetFilter = useCallback(() => {
    setFilters({
      senderDepartment: "",
      receiverDepartment: "",
      model: "",
      materialType: "",
      color: "",
      size: "",
    })
  }, [])

  // Backdrop component
  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  )

  const renderSelectItem = (label: string, value: string, options: string[], field: keyof typeof filters) => (
    <View style={styles.selectContainer}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, filters[field] === option && styles.selectedOption]}
            onPress={() => setFilters({ ...filters, [field]: option })}
            activeOpacity={0.7}
          >
            <Text style={[styles.optionText, filters[field] === option && styles.selectedOptionText]}>{option}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )

  return (
    <>
      <TouchableOpacity style={styles.filterButton} onPress={handlePresentModalPress} activeOpacity={0.7}>
        <Filter width={18} height={18} color="white" />
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={styles.indicator}
      >
        <View style={styles.contentContainer}>
          <LinearGradient
            colors={['#5e72e4', '#324cdd']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <Text style={styles.title}>Filtrlash</Text>
            </View>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={handleClosePress}
              activeOpacity={0.7}
            >
              <X width={20} height={20} color="white" />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView style={styles.scrollView}>
            {renderSelectItem("Yuboruvchi bo'lim", filters.senderDepartment, departments, "senderDepartment")}
            {renderSelectItem("Qabul qiluvchi bo'lim", filters.receiverDepartment, departments, "receiverDepartment")}
            {renderSelectItem("Model", filters.model, models, "model")}
            {renderSelectItem("Mato turi", filters.materialType, materials, "materialType")}
            {renderSelectItem("Rangi", filters.color, colors, "color")}
            {renderSelectItem("O'lchami", filters.size, sizes, "size")}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.resetButton} 
              onPress={handleResetFilter}
              activeOpacity={0.7}
            >
              <Text style={styles.resetButtonText}>Tozalash</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.applyButton} 
              onPress={handleApplyFilter}
              activeOpacity={0.7}
            >
              <Text style={styles.applyButtonText}>Qo'llash</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </>
  )
}

const styles = StyleSheet.create({
  filterButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  filterButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 6,
  },
  contentContainer: {
    flex: 1,
  },
  indicator: {
    backgroundColor: "#5e72e4",
    width: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
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
  scrollView: {
    padding: 20,
  },
  selectContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#525f7f",
    marginBottom: 10,
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
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e6e9f0",
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#f8f9fe",
    padding: 14,
    borderRadius: 12,
    marginRight: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e6e9f0",
  },
  resetButtonText: {
    color: "#525f7f",
    fontWeight: "600",
  },
  applyButton: {
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
  applyButtonText: {
    color: "white",
    fontWeight: "600",
  },
})

export default FilterBottomSheet