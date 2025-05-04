"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from "react-native"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { Users, Tag,  X, Plus, Briefcase, Type } from "react-native-feather"
import { UserList, SimpleList } from "../components/AdminComponents"
import type { User as UserType, Department, Color, Size } from "../types"

// Mock data
const mockUsers: UserType[] = [
  {
    id: "1",
    fullName: "Admin Adminov",
    username: "admin",
    password: "admin123",
    department: "Boshqaruv",
    role: "admin",
  },
  {
    id: "2",
    fullName: "Foydalanuvchi Foydalanuvchiyev",
    username: "user",
    password: "user123",
    department: "Tikuv",
    role: "user",
  },
  {
    id: "3",
    fullName: "Ombor Omborchiyev",
    username: "ombor",
    password: "ombor123",
    department: "Ombor",
    role: "user",
  },
]

const mockDepartments: Department[] = [
  { id: "1", name: "Boshqaruv" },
  { id: "2", name: "Tikuv" },
  { id: "3", name: "Ombor" },
  { id: "4", name: "Bichish" },
  { id: "5", name: "Qadoqlash" },
]

const mockColors: Color[] = [
  { id: "1", name: "Qora" },
  { id: "2", name: "Oq" },
  { id: "3", name: "Ko'k" },
  { id: "4", name: "Qizil" },
  { id: "5", name: "Yashil" },
]

const mockSizes: Size[] = [
  { id: "1", name: "XS" },
  { id: "2", name: "S" },
  { id: "3", name: "M" },
  { id: "4", name: "L" },
  { id: "5", name: "XL" },
  { id: "6", name: "XXL" },
]

type ModalType = "user" | "department" | "color" | "size" | null

const AdminScreen = () => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<"users" | "departments" | "colors" | "sizes">("users")
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState<ModalType>(null)
  const [refreshing, setRefreshing] = useState(false)

  const [users, setUsers] = useState<UserType[]>(mockUsers)
  const [departments, setDepartments] = useState<Department[]>(mockDepartments)
  const [colors, setColors] = useState<Color[]>(mockColors)
  const [sizes, setSizes] = useState<Size[]>(mockSizes)

  const [newUser, setNewUser] = useState<Partial<UserType>>({})
  const [newDepartment, setNewDepartment] = useState("")
  const [newColor, setNewColor] = useState("")
  const [newSize, setNewSize] = useState("")

  const [editingId, setEditingId] = useState<string | null>(null)

  const onRefresh = () => {
    setRefreshing(true)
    // Simulate data fetching
    setTimeout(() => {
      setRefreshing(false)
      showToast({
        type: "success",
        message: "Ma'lumotlar yangilandi",
      })
    }, 1500)
  }

  const openModal = (type: ModalType, id?: string) => {
    setModalType(type)
    setModalVisible(true)
    setEditingId(id || null)

    if (id) {
      if (type === "user") {
        const userToEdit = users.find((u) => u.id === id)
        if (userToEdit) setNewUser({ ...userToEdit })
      } else if (type === "department") {
        const deptToEdit = departments.find((d) => d.id === id)
        if (deptToEdit) setNewDepartment(deptToEdit.name)
      } else if (type === "color") {
        const colorToEdit = colors.find((c) => c.id === id)
        if (colorToEdit) setNewColor(colorToEdit.name)
      } else if (type === "size") {
        const sizeToEdit = sizes.find((s) => s.id === id)
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
    setNewUser({})
    setNewDepartment("")
    setNewColor("")
    setNewSize("")
    setEditingId(null)
  }

  const handleAddUser = () => {
    if (!newUser.fullName || !newUser.username || !newUser.password || !newUser.department) {
      showToast({
        type: "warning",
        message: "Barcha maydonlarni to'ldiring",
      })
      return
    }

    if (editingId) {
      setUsers(users.map((u) => (u.id === editingId ? ({ ...u, ...newUser } as UserType) : u)))
      showToast({
        type: "success",
        message: "Foydalanuvchi muvaffaqiyatli tahrirlandi",
      })
    } else {
      const newId = Math.random().toString(36).substr(2, 9)
      setUsers([...users, { id: newId, role: "user", ...newUser } as UserType])
      showToast({
        type: "success",
        message: "Foydalanuvchi muvaffaqiyatli qo'shildi",
      })
    }

    closeModal()
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
      setDepartments(departments.map((d) => (d.id === editingId ? { ...d, name: newDepartment } : d)))
      showToast({
        type: "success",
        message: "Bo'lim muvaffaqiyatli tahrirlandi",
      })
    } else {
      const newId = Math.random().toString(36).substr(2, 9)
      setDepartments([...departments, { id: newId, name: newDepartment }])
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
      setColors(colors.map((c) => (c.id === editingId ? { ...c, name: newColor } : c)))
      showToast({
        type: "success",
        message: "Rang muvaffaqiyatli tahrirlandi",
      })
    } else {
      const newId = Math.random().toString(36).substr(2, 9)
      setColors([...colors, { id: newId, name: newColor }])
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
      setSizes(sizes.map((s) => (s.id === editingId ? { ...s, name: newSize } : s)))
      showToast({
        type: "success",
        message: "O'lcham muvaffaqiyatli tahrirlandi",
      })
    } else {
      const newId = Math.random().toString(36).substr(2, 9)
      setSizes([...sizes, { id: newId, name: newSize }])
      showToast({
        type: "success",
        message: "O'lcham muvaffaqiyatli qo'shildi",
      })
    }

    closeModal()
  }

  const handleDelete = (type: "user" | "department" | "color" | "size", id: string) => {
    if (type === "user") {
      setUsers(users.filter((u) => u.id !== id))
    } else if (type === "department") {
      setDepartments(departments.filter((d) => d.id !== id))
    } else if (type === "color") {
      setColors(colors.filter((c) => c.id !== id))
    } else if (type === "size") {
      setSizes(sizes.filter((s) => s.id !== id))
    }

    showToast({
      type: "success",
      message: "Muvaffaqiyatli o'chirildi",
    })
  }

  const renderUserModal = () => (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {editingId ? "Foydalanuvchini tahrirlash" : "Yangi foydalanuvchi qo'shish"}
          </Text>
          <TouchableOpacity onPress={closeModal}>
            <X width={24} height={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalForm}>
          <Text style={styles.label}>To'liq ism</Text>
          <TextInput
            style={styles.input}
            placeholder="To'liq ismni kiriting"
            value={newUser.fullName}
            onChangeText={(text) => setNewUser({ ...newUser, fullName: text })}
          />

          <Text style={styles.label}>Foydalanuvchi nomi</Text>
          <TextInput
            style={styles.input}
            placeholder="Foydalanuvchi nomini kiriting"
            value={newUser.username}
            onChangeText={(text) => setNewUser({ ...newUser, username: text })}
          />

          <Text style={styles.label}>Parol</Text>
          <TextInput
            style={styles.input}
            placeholder="Parolni kiriting"
            value={newUser.password}
            onChangeText={(text) => setNewUser({ ...newUser, password: text })}
            secureTextEntry
          />

          <Text style={styles.label}>Bo'lim</Text>
          <View style={styles.optionsContainer}>
            {departments.map((dept) => (
              <TouchableOpacity
                key={dept.id}
                style={[styles.option, newUser.department === dept.name && styles.selectedOption]}
                onPress={() => setNewUser({ ...newUser, department: dept.name })}
              >
                <Text style={[styles.optionText, newUser.department === dept.name && styles.selectedOptionText]}>
                  {dept.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Rol</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[styles.option, newUser.role === "user" && styles.selectedOption]}
              onPress={() => setNewUser({ ...newUser, role: "user" })}
            >
              <Text style={[styles.optionText, newUser.role === "user" && styles.selectedOptionText]}>
                Foydalanuvchi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.option, newUser.role === "admin" && styles.selectedOption]}
              onPress={() => setNewUser({ ...newUser, role: "admin" })}
            >
              <Text style={[styles.optionText, newUser.role === "admin" && styles.selectedOptionText]}>
                Administrator
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
            <Text style={styles.cancelButtonText}>Bekor qilish</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleAddUser}>
            <Text style={styles.saveButtonText}>Saqlash</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )

  const renderSimpleModal = () => {
    let title = ""
    let placeholder = ""
    let value = ""
    let onChangeText = (text: string) => {}
    let onSave = () => {}

    if (modalType === "department") {
      title = editingId ? "Bo'limni tahrirlash" : "Yangi bo'lim qo'shish"
      placeholder = "Bo'lim nomini kiriting"
      value = newDepartment
      onChangeText = setNewDepartment
      onSave = handleAddDepartment
    } else if (modalType === "color") {
      title = editingId ? "Rangni tahrirlash" : "Yangi rang qo'shish"
      placeholder = "Rang nomini kiriting"
      value = newColor
      onChangeText = setNewColor
      onSave = handleAddColor
    } else if (modalType === "size") {
      title = editingId ? "O'lchamni tahrirlash" : "Yangi o'lcham qo'shish"
      placeholder = "O'lcham nomini kiriting"
      value = newSize
      onChangeText = setNewSize
      onSave = handleAddSize
    }

    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={closeModal}>
              <X width={24} height={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalForm}>
            <TextInput style={styles.input} placeholder={placeholder} value={value} onChangeText={onChangeText} />
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
              <Text style={styles.cancelButtonText}>Bekor qilish</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={onSave}>
              <Text style={styles.saveButtonText}>Saqlash</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin boshqaruvi</Text>
        <Text style={styles.subtitle}>{user?.department} bo'limi</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "users" && styles.activeTab]}
          onPress={() => setActiveTab("users")}
        >
          <Users width={20} height={20} color={activeTab === "users" ? "white" : "#333"} />
          <Text style={[styles.tabText, activeTab === "users" && styles.activeTabText]}>Xodimlar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "departments" && styles.activeTab]}
          onPress={() => setActiveTab("departments")}
        >
          <Briefcase width={20} height={20} color={activeTab === "departments" ? "white" : "#333"} />
          <Text style={[styles.tabText, activeTab === "departments" && styles.activeTabText]}>Bo'limlar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "colors" && styles.activeTab]}
          onPress={() => setActiveTab("colors")}
        >
          <Type width={20} height={20} color={activeTab === "departments" ? "white" : "#333"} />
          <Text style={[styles.tabText, activeTab === "colors" && styles.activeTabText]}>Ranglar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "sizes" && styles.activeTab]}
          onPress={() => setActiveTab("sizes")}
        >
          <Tag width={20} height={20} color={activeTab === "sizes" ? "white" : "#333"} />
          <Text style={[styles.tabText, activeTab === "sizes" && styles.activeTabText]}>O'lchamlar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === "users" && (
          <UserList 
            users={users} 
            onEdit={(id) => openModal("user", id)} 
            onDelete={(id) => handleDelete("user", id)} 
          />
        )}

        {activeTab === "departments" && (
          <SimpleList
            data={departments}
            onEdit={(id) => openModal("department", id)}
            onDelete={(id) => handleDelete("department", id)}
          />
        )}

        {activeTab === "colors" && (
          <SimpleList
            data={colors}
            onEdit={(id) => openModal("color", id)}
            onDelete={(id) => handleDelete("color", id)}
          />
        )}

        {activeTab === "sizes" && (
          <SimpleList
            data={sizes}
            onEdit={(id) => openModal("size", id)}
            onDelete={(id) => handleDelete("size", id)}
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          openModal(
            activeTab === "users"
              ? "user"
              : activeTab === "departments"
                ? "department"
                : activeTab === "colors"
                  ? "color"
                  : "size",
          )
        }
      >
        <Plus width={24} height={24} color="white" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={closeModal}>
        {modalType === "user" ? renderUserModal() : renderSimpleModal()}
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "white",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    margin: 16,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  activeTab: {
    backgroundColor: "#3498db",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    marginTop: 4,
  },
  activeTabText: {
    color: "white",
  },
  content: {
    flex: 1,
  },
  addButton: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  modalForm: {
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
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    marginRight: 8,
    marginBottom: 8,
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
  modalActions: {
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
  saveButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#3498db",
    marginLeft: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "500",
  },
})

export default AdminScreen
