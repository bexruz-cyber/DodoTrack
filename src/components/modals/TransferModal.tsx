import { useState, useEffect } from "react"
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
import { Product } from "../../types/apiType"
import { axiosInstance } from "../../api/axios"
import { useAppData } from "../../api/categoryData"

interface TransferModalProps {
  visible: boolean
  onClose: () => void
  item: Product | null
  onSuccess: () => void
}

const TransferModal: React.FC<TransferModalProps> = ({ visible, onClose, item, onSuccess }) => {
  const { user } = useAuth()
  const { showToast } = useToast()

  const [qabulQiluvchiBolimId, setQabulQiluvchiBolimId] = useState("")
  const [qabulQiluvchiUsername, setQabulQiluvchiUsername] = useState("")

  const [yuborilganSoni, setYuborilganSoni] = useState("")
  const [yaroqsizlarSoni, setYaroqsizlarSoni] = useState("")
  const [sababi, setSababi] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const { employees, employeeTypes, loading } = useAppData()

  useEffect(() => {
    console.log(qabulQiluvchiBolimId);
  }, [qabulQiluvchiBolimId])


  const handleSubmit = async () => {
    if (!item || !user) return

    if (!qabulQiluvchiBolimId) {
      showToast({
        type: "warning",
        message: "Qabul qiluvchi bo'limni tanlang",
      })
      return
    }

    if (!yuborilganSoni) {
      showToast({
        type: "warning",
        message: "Yuborilgan sonini kiriting",
      })
      return
    }

    const transferCount = parseInt(yuborilganSoni)
    if (isNaN(transferCount) || transferCount <= 0) {
      showToast({
        type: "warning",
        message: "Noto'g'ri son kiritildi",
      })
      return
    }

    // Check if we have enough items to transfer
    if (transferCount > item.umumiySoni) {
      showToast({
        type: "warning",
        message: "Yuborilgan son mavjud sondan ko'p bo'lishi mumkin emas",
      })
      return
    }

    if (!yaroqsizlarSoni) {
      setYaroqsizlarSoni("0") // Default to 0 if not provided
    }

    const defectCount = parseInt(yaroqsizlarSoni || "0")
    if (isNaN(defectCount) || defectCount < 0) {
      showToast({
        type: "warning",
        message: "Noto'g'ri yaroqsizlar soni kiritildi",
      })
      return
    }

    // Check if defect count is valid
    if (defectCount > item.umumiySoni) {
      showToast({
        type: "warning",
        message: "Yaroqsizlar soni umumiy sondan ko'p bo'lishi mumkin emas",
      })
      return
    }

    setSubmitting(true)
    console.log("qabulQiluvchiBolimId", qabulQiluvchiBolimId);
    console.log("user bolim", user.employee.departmentId);
    console.log("user hodim", qabulQiluvchiUsername);



    try {
      const payload = {
        id: item.id,
        userId: user.id,
        qabulQiluvchiBolimId: qabulQiluvchiBolimId,
        yuborilganSoni: yuborilganSoni,
        userName: qabulQiluvchiUsername,
        yaroqsizlar: {
          soni: yaroqsizlarSoni || "0",
          sababi: sababi || "",
        }
      }

      console.log("payload", payload);
      

      await axiosInstance.post('/api/mainLineProgress/complete/', payload)

      showToast({
        type: "success",
        message: "Ma'lumot uzatildi",
      })

      // Reset form and close modal
      setQabulQiluvchiBolimId("")
      setYuborilganSoni("")
      setYaroqsizlarSoni("")
      setSababi("")
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error("Uzatishda xatolik:", error.response.data)
      showToast({
        type: "error",
        message: "Ma'lumotni uzatishda xatolik yuz berdi",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (!item) return null

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.centeredView}>
        <View style={styles.modalView}>
          <LinearGradient
            colors={['#5e72e4', '#324cdd']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <View style={styles.iconContainer}>
                <Package width={24} height={24} color="white" />
              </View>
              <Text style={styles.title}>Uzatish</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
              disabled={submitting}
            >
              <X width={20} height={20} color="white" />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView style={styles.formContainer}>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Model:</Text>
                <Text style={styles.infoValue}>{item.model}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Rang:</Text>
                <Text style={styles.infoValue}>{item.color?.[0]?.name || "Mavjud emas"}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>O'lcham:</Text>
                <Text style={styles.infoValue}>{item.size?.[0]?.name || "Mavjud emas"}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Mavjud soni:</Text>
                <Text style={styles.infoValue}>{item.umumiySoni}</Text>
              </View>
            </View>

            <Text style={styles.label}>Qabul qiluvchi bo'lim <Text style={styles.required}>*</Text></Text>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#5e72e4" size="small" />
                <Text style={styles.loadingText}>Bo'limlar yuklanmoqda...</Text>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
                {employeeTypes.map((dept) => (
                  <TouchableOpacity
                    key={dept.id}
                    style={[styles.option, qabulQiluvchiBolimId === dept.id && styles.selectedOption]}
                    onPress={() => setQabulQiluvchiBolimId(dept.id)}
                    activeOpacity={0.7}
                    disabled={submitting}
                  >
                    <Text style={[styles.optionText, qabulQiluvchiBolimId === dept.id && styles.selectedOptionText]}>
                      {dept.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <Text style={styles.label}>Qabul qiluvchi hodim <Text style={styles.required}>*</Text></Text>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#5e72e4" size="small" />
                <Text style={styles.loadingText}>Bo'limlar yuklanmoqda...</Text>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
                {employees.map((user) => (
                  <TouchableOpacity
                    key={user.id}
                    style={[styles.option, qabulQiluvchiUsername === user.login && styles.selectedOption]}
                    onPress={() => setQabulQiluvchiUsername(user.login)}
                    activeOpacity={0.7}
                    disabled={submitting}
                  >
                    <Text style={[styles.optionText, qabulQiluvchiUsername === user.login && styles.selectedOptionText]}>
                      {user.login}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <Text style={styles.label}>Yuborilgan soni <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Yuborilgan sonini kiriting"
              keyboardType="numeric"
              value={yuborilganSoni}
              onChangeText={setYuborilganSoni}
              placeholderTextColor="#8898aa"
              editable={!submitting}
            />

            <Text style={styles.label}>Yaroqsizlar soni</Text>
            <TextInput
              style={styles.input}
              placeholder="Yaroqsizlar sonini kiriting"
              keyboardType="numeric"
              value={yaroqsizlarSoni}
              onChangeText={setYaroqsizlarSoni}
              placeholderTextColor="#8898aa"
              editable={!submitting}
            />

            <Text style={styles.label}>Yaroqsizlik sababi</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Yaroqsizlik sababini kiriting"
              multiline
              numberOfLines={4}
              value={sababi}
              onChangeText={setSababi}
              placeholderTextColor="#8898aa"
              textAlignVertical="top"
              editable={!submitting}
            />
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
              disabled={submitting}
            >
              <Text style={styles.cancelButtonText}>Bekor qilish</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              activeOpacity={0.7}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Uzatish</Text>
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
  infoCard: {
    backgroundColor: "#f8f9fe",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e6e9f0",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e9f0",
  },
  infoLabel: {
    fontSize: 14,
    color: "#8898aa",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#32325d",
    fontWeight: "600",
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
    marginBottom: 50
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
    backgroundColor: "#fb6340",
    padding: 14,
    borderRadius: 12,
    marginLeft: 8,
    alignItems: "center",
    shadowColor: "#fb6340",
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
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f8f9fe",
    borderRadius: 12,
    marginBottom: 8,
  },
  loadingText: {
    marginLeft: 8,
    color: "#8898aa",
    fontSize: 14,
  },
})

export default TransferModal
