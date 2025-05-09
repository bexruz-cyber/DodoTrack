import React, { useCallback, useRef, useMemo, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native"
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet"

// Type definitions from your data
export interface Employee {
  id: string
  login: string
  department: {
    id: string,
    name: string
  }
  departmentId: string
  createdAt: string
  updatedAt: string
}

export interface Color {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface Size {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface EmployeeType {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

type FilterOption = {
  label: string
  value: string
  options: string[]
  field: string
}

type FilterValues = {
  [key: string]: string
}

type FilterBottomSheetProps = {
  colors: Color[]
  sizes: Size[]
  employeeTypes: EmployeeType[]
  initialValues?: FilterValues
  onApply: (values: FilterValues) => void
  onReset?: () => void
}

const FilterBottomSheet = React.forwardRef<BottomSheet, FilterBottomSheetProps>(
  ({ colors, sizes, employeeTypes, initialValues = {}, onApply, onReset }, ref) => {
    // Create filter options from the provided data
    const filterOptions = useMemo(() => [
      {
        label: "Rang",
        field: "color",
        value: "",
        options: colors.map(color => color.name)
      },
      {
        label: "O'lcham",
        field: "size",
        value: "",
        options: sizes.map(size => size.name)
      },
      {
        label: "Xodim turi",
        field: "employeeType",
        value: "",
        options: employeeTypes.map(type => type.name)
      }
    ], [colors, sizes, employeeTypes])

    // Create default filter values if not provided
    const defaultValues = useMemo(() => {
      const values: FilterValues = {}
      filterOptions.forEach(option => {
        values[option.field] = initialValues[option.field] || ""
      })
      return values
    }, [filterOptions, initialValues])

    const [filterValues, setFilterValues] = useState<FilterValues>(defaultValues)
    
    // Bottom Sheet snap points
    const snapPoints = useMemo(() => ["70%"], [])

    // Bottom Sheet backdrop component
    const renderBackdrop = useCallback(
      (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
      []
    )

    const handleApplyFilter = useCallback(() => {
      onApply(filterValues)
      // Close the bottom sheet
      if (ref && 'current' in ref && ref.current) {
        ref.current.close()
      }
    }, [filterValues, onApply, ref])

    const handleResetFilter = useCallback(() => {
      const emptyValues: FilterValues = {}
      filterOptions.forEach(option => {
        emptyValues[option.field] = ""
      })
      setFilterValues(emptyValues)
      if (onReset) onReset()
    }, [filterOptions, onReset])

    const renderFilterSelectItem = (option: FilterOption) => (
      <View style={styles.selectContainer} key={option.field}>
        <Text style={styles.filterLabel}>{option.label}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
          {option.options.map((optionItem) => (
            <TouchableOpacity
              key={optionItem}
              style={[
                styles.option, 
                filterValues[option.field] === optionItem && styles.selectedOption
              ]}
              onPress={() => setFilterValues({ ...filterValues, [option.field]: optionItem })}
              activeOpacity={0.7}
            >
              <Text 
                style={[
                  styles.optionText, 
                  filterValues[option.field] === optionItem && styles.selectedOptionText
                ]}
              >
                {optionItem}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={styles.indicator}
        enableContentPanningGesture={false}
      >
        <View style={styles.contentContainer}>
          <View style={styles.headerContent}>
            <Text style={styles.filterTitle}>Filtrlash</Text>
          </View>

          <ScrollView style={styles.scrollView}>
            {filterOptions.map(option => renderFilterSelectItem(option))}
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
    )
  }
)

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  indicator: {
    backgroundColor: "#5e72e4",
    width: 40,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#32325d",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    padding: 20,
    maxHeight: 420,
  },
  selectContainer: {
    marginBottom: 20,
  },
  filterLabel: {
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