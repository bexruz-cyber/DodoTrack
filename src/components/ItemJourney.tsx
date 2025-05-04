import type React from "react"
import { View, Text, StyleSheet } from "react-native"

interface JourneyStep {
  department: string
  date: string
  status: "completed" | "current" | "pending"
}

interface ItemJourneyProps {
  steps: JourneyStep[]
}

const ItemJourney: React.FC<ItemJourneyProps> = ({ steps }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tovar haritasi</Text>
      <View style={styles.timeline}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.stepIconContainer}>
              <View
                style={[
                  styles.stepIcon,
                  step.status === "completed" && styles.completedIcon,
                  step.status === "current" && styles.currentIcon,
                  step.status === "pending" && styles.pendingIcon,
                ]}
              />
              {index < steps.length - 1 && <View style={styles.stepLine} />}
            </View>
            <View style={styles.stepContent}>
              <Text
                style={[
                  styles.stepDepartment,
                  step.status === "completed" && styles.completedText,
                  step.status === "current" && styles.currentText,
                  step.status === "pending" && styles.pendingText,
                ]}
              >
                {step.department}
              </Text>
              {step.status !== "pending" && <Text style={styles.stepDate}>{step.date}</Text>}
              {step.status === "current" && <Text style={styles.currentStatus}>Hozirda shu bo'limda</Text>}
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  timeline: {
    paddingLeft: 8,
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  stepIconContainer: {
    alignItems: "center",
    marginRight: 12,
  },
  stepIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    zIndex: 1,
  },
  completedIcon: {
    backgroundColor: "#2ecc71",
    borderColor: "#2ecc71",
  },
  currentIcon: {
    backgroundColor: "#3498db",
    borderColor: "#3498db",
  },
  pendingIcon: {
    backgroundColor: "white",
    borderColor: "#bdc3c7",
  },
  stepLine: {
    position: "absolute",
    top: 20,
    width: 2,
    height: 30,
    backgroundColor: "#e0e0e0",
    zIndex: 0,
  },
  stepContent: {
    flex: 1,
  },
  stepDepartment: {
    fontSize: 16,
    fontWeight: "500",
  },
  completedText: {
    color: "#2ecc71",
  },
  currentText: {
    color: "#3498db",
  },
  pendingText: {
    color: "#95a5a6",
  },
  stepDate: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 4,
  },
  currentStatus: {
    fontSize: 12,
    color: "#3498db",
    fontWeight: "bold",
    marginTop: 4,
  },
})

export default ItemJourney
