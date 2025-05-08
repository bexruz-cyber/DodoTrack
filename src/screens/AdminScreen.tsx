import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Alert,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { axiosInstance } from "../api/axios"
import TabBar from "../components/tabs/TabBar"
import EmployeeList from "../components/lists/EmployeeList"
import DepartmentList from "../components/lists/DepartmentList"
import ColorList from "../components/lists/ColorList"
import SizeList from "../components/lists/SizeList"
import EmployeeModal from "../components/modals/EmployeeModal"
import SimpleModal from "../components/modals/SimpleModal"
import { Plus } from "react-native-feather"
import LinearGradient from "react-native-linear-gradient"
import { Color, Employee, EmployeeType, Size } from "../types/apiType"

const AdminScreen = () => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<"users" | "departments" | "colors" | "sizes">("users")
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState<"user" | "department" | "color" | "size" | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(false)

  const [employees, setEmployees] = useState<Employee[]>([])
  const [employeeTypes, setEmployeeTypes] = useState<EmployeeType[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [sizes, setSizes] = useState<Size[]>([])

  const [newEmployee, setNewEmployee] = useState({
    login: "",
    password: "",
    typeId: "",
  })
  const [newDepartment, setNewDepartment] = useState("")
  const [newColor, setNewColor] = useState("")
  const [newSize, setNewSize] = useState("")

  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchEmployees()
    fetchEmployeeTypes()
    fetchColors()
    fetchSizes()
  }, [])


  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get("/api/employees")
      setEmployees(response.data)
    } catch (error) {
      console.error("Error fetching employees:", error)
      throw error
    }
  }

  const fetchEmployeeTypes = async () => {
    try {
      const response = await axiosInstance.get("/api/employeeType")
      setEmployeeTypes(response.data)
    } catch (error) {
      console.error("Error fetching employee types:", error)
      throw error
    }
  }

  const fetchColors = async () => {
    try {
      const response = await axiosInstance.get("/api/color")
      setColors(response.data)
    } catch (error) {
      console.error("Error fetching colors:", error)
      throw error
    }
  }

  const fetchSizes = async () => {
    try {
      const response = await axiosInstance.get("/api/size")
      setSizes(response.data)
    } catch (error) {
      console.error("Error fetching sizes:", error)
      throw error
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      await fetchEmployees()
      await fetchEmployeeTypes()
      await fetchColors()
      await fetchSizes()
      showToast({
        type: "success",
        message: "Ma'lumotlar yangilandi",
      })
    } catch (error) {
      console.error("Error refreshing data:", error)
      showToast({
        type: "error",
        message: "Ma'lumotlarni yangilashda xatolik yuz berdi",
      })
    } finally {
      setRefreshing(false)
    }
  }

  const handleAddButtonPress = () => {
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
        const employeeToEdit = employees.find((e) => e.id === id)
        if (employeeToEdit) {
          setNewEmployee({
            login: employeeToEdit.login,
            password: "", // Password field is empty when editing
            typeId: employeeToEdit.departmentId,
          })
        }
      } else if (type === "department") {
        const deptToEdit = employeeTypes.find((dept) => dept.id === id)
        if (deptToEdit) setNewDepartment(deptToEdit.name)
      } else if (type === "color") {
        const colorToEdit = colors.find((color) => color.id === id)
        if (colorToEdit) setNewColor(colorToEdit.name)
      } else if (type === "size") {
        const sizeToEdit = sizes.find((size) => size.id === id)
        if (sizeToEdit) setNewSize(sizeToEdit.name)
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
      typeId: employeeTypes.length > 0 ? employeeTypes[0].name.toLowerCase() : "",
    })
    setNewDepartment("")
    setNewColor("")
    setNewSize("")
    setEditingId(null)
  }

  const handleAddEmployee = async () => {
    if (!newEmployee.login || !newEmployee.typeId) {
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
          password: newEmployee.password || undefined, // Only send if not empty
          type: newEmployee.typeId
        })
        showToast({
          type: "success",
          message: "Xodim muvaffaqiyatli tahrirlandi",
        })
      } else {
        await axiosInstance.post("/api/employees", {
          login: newEmployee.login,
          password: newEmployee.password, // Use default if empty
          typeId: newEmployee.typeId
        })
        showToast({
          type: "success",
          message: "Xodim muvaffaqiyatli qo'shildi",
        })
      }
      await fetchEmployees()
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

  const handleAddDepartment = async () => {
    if (!newDepartment) {
      showToast({
        type: "warning",
        message: "Bo'lim nomini kiriting",
      })
      return
    }

    console.log(newDepartment);


    setLoading(true)
    try {
      if (editingId) {
        await axiosInstance.put(`/api/employeeType/${editingId}`, {
          name: newDepartment
        })
        showToast({
          type: "success",
          message: "Bo'lim muvaffaqiyatli tahrirlandi",
        })
      } else {
        await axiosInstance.post("/api/employeeType", {
          name: newDepartment
        })
        showToast({
          type: "success",
          message: "Bo'lim muvaffaqiyatli qo'shildi",
        })
      }
      showToast({
        type: "success",
        message: "Bo'lim muvaffaqiyatli qo'shildi",
      })
      await fetchEmployeeTypes()
      closeModal()
    } catch (error: any) {
      console.error("Error saving department:", error.response)
      showToast({
        type: "error",
        message: "Bo'limni saqlashda xatolik yuz berdi",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddColor = async () => {
    if (!newColor) {
      showToast({
        type: "warning",
        message: "Rang nomini kiriting",
      })
      return
    }

    setLoading(true)
    try {
      if (editingId) {
        await axiosInstance.put(`/api/color/${editingId}`, {
          name: newColor
        })
        showToast({
          type: "success",
          message: "Rang muvaffaqiyatli tahrirlandi",
        })
      } else {
        await axiosInstance.post("/api/color", {
          name: newColor
        })
        showToast({
          type: "success",
          message: "Rang muvaffaqiyatli qo'shildi",
        })
      }
      await fetchColors()
      closeModal()
    } catch (error) {
      console.error("Error saving color:", error)
      showToast({
        type: "error",
        message: "Rangni saqlashda xatolik yuz berdi",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddSize = async () => {
    if (!newSize) {
      showToast({
        type: "warning",
        message: "O'lcham nomini kiriting",
      })
      return
    }

    setLoading(true)
    try {
      if (editingId) {
        await axiosInstance.put(`/api/size/${editingId}`, {
          name: newSize
        })
        showToast({
          type: "success",
          message: "O'lcham muvaffaqiyatli tahrirlandi",
        })
      } else {
        await axiosInstance.post("/api/size", {
          name: newSize
        })
        showToast({
          type: "success",
          message: "O'lcham muvaffaqiyatli qo'shildi",
        })
      }
      await fetchSizes()
      closeModal()
    } catch (error) {
      console.error("Error saving size:", error)
      showToast({
        type: "error",
        message: "O'lchamni saqlashda xatolik yuz berdi",
      })
    } finally {
      setLoading(false)
    }
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
            await fetchEmployees()
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

  const handleDeleteDepartment = async (id: string) => {
    Alert.alert("Tasdiqlash", "Haqiqatan ham bu bo'limni o'chirmoqchimisiz?", [
      { text: "Bekor qilish", style: "cancel" },
      {
        text: "O'chirish",
        style: "destructive",
        onPress: async () => {
          setLoading(true)
          try {
            await axiosInstance.delete(`/api/employeeType/${id}`)
            await fetchEmployeeTypes()
            showToast({
              type: "success",
              message: "Bo'lim muvaffaqiyatli o'chirildi",
            })
          } catch (error) {
            console.error("Error deleting department:", error)
            showToast({
              type: "error",
              message: "Bo'limni o'chirishda xatolik yuz berdi",
            })
          } finally {
            setLoading(false)
          }
        },
      },
    ])
  }

  const handleDeleteColor = async (id: string) => {
    Alert.alert("Tasdiqlash", "Haqiqatan ham bu rangni o'chirmoqchimisiz?", [
      { text: "Bekor qilish", style: "cancel" },
      {
        text: "O'chirish",
        style: "destructive",
        onPress: async () => {
          setLoading(true)
          try {
            await axiosInstance.delete(`/api/color/${id}`)
            await fetchColors()
            showToast({
              type: "success",
              message: "Rang muvaffaqiyatli o'chirildi",
            })
          } catch (error) {
            console.error("Error deleting color:", error)
            showToast({
              type: "error",
              message: "Rangni o'chirishda xatolik yuz berdi",
            })
          } finally {
            setLoading(false)
          }
        },
      },
    ])
  }

  const handleDeleteSize = async (id: string) => {
    Alert.alert("Tasdiqlash", "Haqiqatan ham bu o'lchamni o'chirmoqchimisiz?", [
      { text: "Bekor qilish", style: "cancel" },
      {
        text: "O'chirish",
        style: "destructive",
        onPress: async () => {
          setLoading(true)
          try {
            await axiosInstance.delete(`/api/size/${id}`)
            await fetchSizes()
            showToast({
              type: "success",
              message: "O'lcham muvaffaqiyatli o'chirildi",
            })
          } catch (error) {
            console.error("Error deleting size:", error)
            showToast({
              type: "error",
              message: "O'lchamni o'chirishda xatolik yuz berdi",
            })
          } finally {
            setLoading(false)
          }
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      <LinearGradient
        colors={['#5e72e4', '#324cdd']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.title}>Admin panel</Text>
        <Text style={styles.subtitle}>{user?.department.name} bo'limi</Text>
      </LinearGradient>
      <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
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
            departments={employeeTypes}
            loading={loading}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onEdit={(id) => openModal("department", id)}
            onDelete={handleDeleteDepartment}
          />
        )}
        {activeTab === "colors" && (
          <ColorList
            colors={colors}
            loading={loading}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onEdit={(id) => openModal("color", id)}
            onDelete={handleDeleteColor}
          />
        )}
        {activeTab === "sizes" && (
          <SizeList
            sizes={sizes}
            loading={loading}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onEdit={(id) => openModal("size", id)}
            onDelete={handleDeleteSize}
          />
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAddButtonPress} activeOpacity={0.8}>
        <Plus width={24} height={24} color="white" />
      </TouchableOpacity>

      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
        {modalType === "user" ? (
          <EmployeeModal
            newEmployee={newEmployee}
            setNewEmployee={setNewEmployee}
            departments={employeeTypes}
            loading={loading}
            editingId={editingId}
            onSave={handleAddEmployee}
            onClose={closeModal}
          />
        ) : (
          <SimpleModal
            loading={loading}
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
    backgroundColor: "#f4f4f4",
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
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