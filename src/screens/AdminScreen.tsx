import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Alert,
  TouchableOpacity,
} from "react-native"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { axiosInstance } from "../api/axios"
import TabBar from "../components/TabBar"
import EmployeeList from "../components/lists/EmployeeList"
import DepartmentList from "../components/lists/DepartmentList"
import ColorList from "../components/lists/ColorList"
import SizeList from "../components/lists/SizeList"
import EmployeeModal from "../components/modals/EmployeeModal"
import SimpleModal from "../components/modals/SimpleModal"
import { Plus } from "react-native-feather"

// Components

// Types
interface Employee {
  id: string
  login: string
  type: string
  createdAt: string
  updatedAt: string
}

const AdminScreen = () => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<"users" | "departments" | "colors" | "sizes">("users")
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState<"user" | "department" | "color" | "size" | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(false)

  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<string[]>(["Tikuv", "Ombor", "Bichish", "Qadoqlash"])
  const [colors, setColors] = useState<string[]>(["Qora", "Oq", "Ko'k", "Qizil", "Yashil"])
  const [sizes, setSizes] = useState<string[]>(["XS", "S", "M", "L", "XL", "XXL"])

  const [newEmployee, setNewEmployee] = useState({
    login: "",
    password: "",
    type: "ombor",
  })
  const [newDepartment, setNewDepartment] = useState("")
  const [newColor, setNewColor] = useState("")
  const [newSize, setNewSize] = useState("")

  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get("/api/employees")
      setEmployees(response.data)
    } catch (error) {
      console.error("Error fetching employees:", error)
      showToast({
        type: "error",
        message: "Xodimlarni yuklashda xatolik yuz berdi",
      })
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      await fetchEmployees()
      showToast({
        type: "success",
        message: "Ma'lumotlar yangilandi",
      })
    } finally {
      setRefreshing(false)
    }
  }

  const handleAddButtonPress = () => {
    // Open the appropriate modal based on the active tab
    if (activeTab === "users") {
      openModal("user")
    } else if (activeTab === "departments") {
      openModal("department")
    } else if (activeTab === "colors") {
      openModal("color")
    } else if (activeTab === "sizes") {
      openModal("size")
    }
  }

  const openModal = (type: "user" | "department" | "color" | "size", id?: string) => {
    setModalType(type)
    setModalVisible(true)
    setEditingId(id || null)

    if (id) {
      if (type === "user") {
        // Find the employee to edit
        const employeeToEdit = employees.find((e) => e.id === id)
        if (employeeToEdit) {
          setNewEmployee({
            login: employeeToEdit.login,
            password: "", // Password field is empty when editing
            type: employeeToEdit.type,
          })
        }
      } else if (type === "department") {
        const deptToEdit = departments.find((_, index) => index.toString() === id)
        if (deptToEdit) setNewDepartment(deptToEdit)
      } else if (type === "color") {
        const colorToEdit = colors.find((_, index) => index.toString() === id)
        if (colorToEdit) setNewColor(colorToEdit)
      } else if (type === "size") {
        const sizeToEdit = sizes.find((_, index) => index.toString() === id)
        if (sizeToEdit) setNewSize(sizeToEdit)
      }
    } else {
      resetForm()
    }
  }

  const closeModal = () => {
    setModalVisible(false)
    setModalType(null)
    resetForm()
  }

  const resetForm = () => {
    setNewEmployee({
      login: "",
      password: "",
      type: "ombor",
    })
    setNewDepartment("")
    setNewColor("")
    setNewSize("")
    setEditingId(null)
  }

  const handleAddEmployee = async () => {
    if (!newEmployee.login || !newEmployee.type) {
      showToast({
        type: "warning",
        message: "Login va bo'lim maydonlarini to'ldiring",
      })
      return
    }

    setLoading(true)
    try {
      if (editingId) {
        await axiosInstance.put(`/api/employees/${editingId}`, {
          login: newEmployee.login,
          password: newEmployee.password || "user123", // Use default if empty
          type: newEmployee.type
        })
        showToast({
          type: "success",
          message: "Xodim muvaffaqiyatli tahrirlandi",
        })
      } else {
        await axiosInstance.post("/api/employees", {
          login: newEmployee.login,
          password: newEmployee.password || "user123", // Use default if empty
          type: newEmployee.type
        })
        showToast({
          type: "success",
          message: "Xodim muvaffaqiyatli qo'shildi",
        })
      }
      fetchEmployees()
      closeModal()
    } catch (error) {
      console.error("Error saving employee:", error)
      showToast({
        type: "error",
        message: "Xodimni saqlashda xatolik yuz berdi",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddDepartment = () => {
    if (!newDepartment) {
      showToast({
        type: "warning",
        message: "Bo'lim nomini kiriting",
      })
      return
    }

    if (editingId) {
      const index = Number.parseInt(editingId)
      const updatedDepartments = [...departments]
      updatedDepartments[index] = newDepartment
      setDepartments(updatedDepartments)
      showToast({
        type: "success",
        message: "Bo'lim muvaffaqiyatli tahrirlandi",
      })
    } else {
      setDepartments([...departments, newDepartment])
      showToast({
        type: "success",
        message: "Bo'lim muvaffaqiyatli qo'shildi",
      })
    }

    closeModal()
  }

  const handleAddColor = () => {
    if (!newColor) {
      showToast({
        type: "warning",
        message: "Rang nomini kiriting",
      })
      return
    }

    if (editingId) {
      const index = Number.parseInt(editingId)
      const updatedColors = [...colors]
      updatedColors[index] = newColor
      setColors(updatedColors)
      showToast({
        type: "success",
        message: "Rang muvaffaqiyatli tahrirlandi",
      })
    } else {
      setColors([...colors, newColor])
      showToast({
        type: "success",
        message: "Rang muvaffaqiyatli qo'shildi",
      })
    }

    closeModal()
  }

  const handleAddSize = () => {
    if (!newSize) {
      showToast({
        type: "warning",
        message: "O'lcham nomini kiriting",
      })
      return
    }

    if (editingId) {
      const index = Number.parseInt(editingId)
      const updatedSizes = [...sizes]
      updatedSizes[index] = newSize
      setSizes(updatedSizes)
      showToast({
        type: "success",
        message: "O'lcham muvaffaqiyatli tahrirlandi",
      })
    } else {
      setSizes([...sizes, newSize])
      showToast({
        type: "success",
        message: "O'lcham muvaffaqiyatli qo'shildi",
      })
    }

    closeModal()
  }

  const handleDeleteEmployee = async (id: string) => {
    Alert.alert("Tasdiqlash", "Haqiqatan ham bu xodimni o'chirmoqchimisiz?", [
      { text: "Bekor qilish", style: "cancel" },
      {
        text: "O'chirish",
        style: "destructive",
        onPress: async () => {
          setLoading(true)
          try {
            await axiosInstance.delete(`/api/employees/${id}`)
            fetchEmployees()
            showToast({
              type: "success",
              message: "Xodim muvaffaqiyatli o'chirildi",
            })
          } catch (error) {
            console.error("Error deleting employee:", error)
            showToast({
              type: "error",
              message: "Xodimni o'chirishda xatolik yuz berdi",
            })
          } finally {
            setLoading(false)
          }
        },
      },
    ])
  }

  const handleDeleteDepartment = (index: number) => {
    Alert.alert("Tasdiqlash", "Haqiqatan ham bu bo'limni o'chirmoqchimisiz?", [
      { text: "Bekor qilish", style: "cancel" },
      {
        text: "O'chirish",
        style: "destructive",
        onPress: () => {
          const updatedDepartments = departments.filter((_, i) => i !== index)
          setDepartments(updatedDepartments)
          showToast({
            type: "success",
            message: "Bo'lim muvaffaqiyatli o'chirildi",
          })
        },
      },
    ])
  }

  const handleDeleteColor = (index: number) => {
    Alert.alert("Tasdiqlash", "Haqiqatan ham bu rangni o'chirmoqchimisiz?", [
      { text: "Bekor qilish", style: "cancel" },
      {
        text: "O'chirish",
        style: "destructive",
        onPress: () => {
          const updatedColors = colors.filter((_, i) => i !== index)
          setColors(updatedColors)
          showToast({
            type: "success",
            message: "Rang muvaffaqiyatli o'chirildi",
          })
        },
      },
    ])
  }

  const handleDeleteSize = (index: number) => {
    Alert.alert("Tasdiqlash", "Haqiqatan ham bu o'lchamni o'chirmoqchimisiz?", [
      { text: "Bekor qilish", style: "cancel" },
      {
        text: "O'chirish",
        style: "destructive",
        onPress: () => {
          const updatedSizes = sizes.filter((_, i) => i !== index)
          setSizes(updatedSizes)
          showToast({
            type: "success",
            message: "O'lcham muvaffaqiyatli o'chirildi",
          })
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin boshqaruvi</Text>
        <Text style={styles.subtitle}>{user?.department} bo'limi</Text>
      </View>

      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "users" && (
        <EmployeeList
          employees={employees}
          loading={loading}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEdit={(id) => openModal("user", id)}
          onDelete={handleDeleteEmployee}
        />
      )}
      {activeTab === "departments" && (
        <DepartmentList
          departments={departments}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEdit={(id) => openModal("department", id.toString())}
          onDelete={handleDeleteDepartment}
        />
      )}
      {activeTab === "colors" && (
        <ColorList
          colors={colors}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEdit={(id) => openModal("color", id.toString())}
          onDelete={handleDeleteColor}
        />
      )}
      {activeTab === "sizes" && (
        <SizeList
          sizes={sizes}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEdit={(id) => openModal("size", id.toString())}
          onDelete={handleDeleteSize}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleAddButtonPress} activeOpacity={0.8}>
        <Plus width={24} height={24} color="white" />
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
        {modalType === "user" ? (
          <EmployeeModal
            newEmployee={newEmployee}
            setNewEmployee={setNewEmployee}
            departments={departments}
            loading={loading}
            editingId={editingId}
            onSave={handleAddEmployee}
            onClose={closeModal}
          />
        ) : (
          <SimpleModal
            modalType={modalType}
            editingId={editingId}
            newDepartment={newDepartment}
            setNewDepartment={setNewDepartment}
            newColor={newColor}
            setNewColor={setNewColor}
            newSize={newSize}
            setNewSize={setNewSize}
            onSaveDepartment={handleAddDepartment}
            onSaveColor={handleAddColor}
            onSaveSize={handleAddSize}
            onClose={closeModal}
          />
        )}
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  header: {
    marginBottom: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
  },
  button: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#5e72e4",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})

export default AdminScreen