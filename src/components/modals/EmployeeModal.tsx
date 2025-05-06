import React from "react"
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native"
import { X } from "react-native-feather"
import LinearGradient from "react-native-linear-gradient"

interface EmployeeModalProps {
  newEmployee: {
    login: string
    password: string
    type: string
  }
  setNewEmployee: React.Dispatch<
    React.SetStateAction<{
      login: string
      password: string
      type: string
    }>
  >
  departments: string[]
  loading: boolean
  editingId: string | null
  onSave: () => void
  onClose: () => void
}

const EmployeeModal = ({
  newEmployee,
  setNewEmployee,
  departments,
  loading,
  editingId,
  onSave,
  onClose,
}: EmployeeModalProps) => {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <LinearGradient
          colors={['#5e72e4', '#324cdd']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.modalHeader}
        >
          <Text style={styles.modalTitle}>{editingId ? "Xodimni tahrirlash" : "Yangi xodim qo'shish"}</Text>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
            activeOpacity={0.7}
          >
            <X width={20} height={20} color="white" />
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView style={styles.modalForm}>
          <Text style={styles.label}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Login kiriting"
            value={newEmployee.login}
            onChangeText={(text) => setNewEmployee({ ...newEmployee, login: text })}
            placeholderTextColor="#8898aa"
          />

          <Text style={styles.label}>Parol</Text>
          <TextInput
            style={styles.input}
            placeholder={editingId ? "Yangi parol kiriting (ixtiyoriy)" : "Parol kiriting"}
            value={newEmployee.password}
            onChangeText={(text) => setNewEmployee({ ...newEmployee, password: text })}
            secureTextEntry
            placeholderTextColor="#8898aa"
          />

          <Text style={styles.label}>Bo'lim</Text>
          <View style={styles.optionsContainer}>
            {departments.map((dept) => (
              <TouchableOpacity
                key={dept}
                style={[styles.option, newEmployee.type === dept.toLowerCase() && styles.selectedOption]}
                onPress={() => setNewEmployee({ ...newEmployee, type: dept.toLowerCase() })}
                activeOpacity={0.7}
              >
                <Text style={[styles.optionText, newEmployee.type === dept.toLowerCase() && styles.selectedOptionText]}>
                  {dept}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.modalActions}>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Bekor qilish</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={onSave} 
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>Saqlash</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(50, 50, 93, 0.4)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    width: "100%",
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
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  modalTitle: {
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
  modalForm: {
    padding: 16,
    maxHeight: 400,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#525f7f",
    marginBottom: 8,
    marginTop: 16,
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
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  option: {
    backgroundColor: "#f8f9fe",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 10,
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
  modalActions: {
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
  saveButton: {
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
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default EmployeeModal