"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import { useRoute, type RouteProp, useNavigation } from "@react-navigation/native"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import ItemJourney from "../components/ItemJourney"
import type { TransferItem, ReceiveItem } from "../types"

type DetailScreenRouteProp = RouteProp<
  {
    Detail: {
      item: TransferItem | ReceiveItem
    }
  },
  "Detail"
>

const DetailScreen = () => {
  const route = useRoute<DetailScreenRouteProp>()
  const navigation = useNavigation()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { item } = route.params

  const isTransferItem = "status" in item
  const isReceiver = user?.department === (item as TransferItem).receiverDepartment

  const handleReceive = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      showToast({
        type: "success",
        message: "Muvaffaqiyatli qabul qilindi",
      })
      setIsLoading(false)
      navigation.goBack()
    }, 1500)
  }

  const renderDetailRow = (label: string, value: string | number) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value.toString()}</Text>
    </View>
  )

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{isTransferItem ? "Uzatma ma'lumotlari" : "Qabul qilish ma'lumotlari"}</Text>
          <Text style={styles.id}>ID: {item.id}</Text>
        </View>

        {item.journey && <ItemJourney steps={item.journey} />}

        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Asosiy ma'lumotlar</Text>
          {renderDetailRow("Ism familya", item.fullName)}
          {renderDetailRow("Yuboruvchi bo'lim", item.senderDepartment)}
          {renderDetailRow("Qabul qiluvchi bo'lim", item.receiverDepartment)}

          {isTransferItem ? (
            <>
              {renderDetailRow("Yuborilgan sana", (item as TransferItem).sendDate)}
              {renderDetailRow("Yuborilgan vaqt", (item as TransferItem).sendTime)}
            </>
          ) : (
            <>
              {renderDetailRow("Qabul qilingan sana", (item as ReceiveItem).receiveDate)}
              {renderDetailRow("Qabul qilingan vaqt", (item as ReceiveItem).receiveTime)}
            </>
          )}

          <Text style={styles.sectionTitle}>Mahsulot ma'lumotlari</Text>
          {renderDetailRow("Model", item.model)}
          {renderDetailRow("Mato turi", item.materialType)}
          {renderDetailRow("Rangi", item.color)}
          {renderDetailRow("O'lchami", item.size)}

          <Text style={styles.sectionTitle}>Miqdor ma'lumotlari</Text>
          {isTransferItem ? (
            <>
              {renderDetailRow("Umumiy soni", (item as TransferItem).totalCount)}
              {renderDetailRow("Qabul qilingan soni", (item as TransferItem).receivedCount)}
              {renderDetailRow("Qolgan soni", (item as TransferItem).totalCount - (item as TransferItem).receivedCount)}
            </>
          ) : (
            <>
              {renderDetailRow("Yuborilgan soni", (item as ReceiveItem).sentCount)}
              {renderDetailRow("Qabul qilingan soni", (item as ReceiveItem).receivedCount)}
              {renderDetailRow("Farq", (item as ReceiveItem).difference)}
            </>
          )}

          {item.additionalNotes && (
            <>
              <Text style={styles.sectionTitle}>Qo'shimcha izoh</Text>
              <Text style={styles.notes}>{item.additionalNotes}</Text>
            </>
          )}
        </View>

        {isTransferItem && isReceiver && (item as TransferItem).receivedCount < (item as TransferItem).totalCount && (
          <TouchableOpacity style={styles.receiveButton} onPress={handleReceive} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.receiveButtonText}>Qabul qilish</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  id: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  detailsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  detailLabel: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  notes: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
  },
  receiveButton: {
    backgroundColor: "#3498db",
    padding: 16,
    alignItems: "center",
    margin: 16,
    borderRadius: 8,
  },
  receiveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default DetailScreen
