import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Check, Circle, Clock } from "react-native-feather"

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
                  styles.stepIconWrapper,
                  step.status === "completed" && styles.completedIconWrapper,
                  step.status === "current" && styles.currentIconWrapper,
                  step.status === "pending" && styles.pendingIconWrapper,
                ]}
              >
                {step.status === "completed" && <Check width={14} height={14} color="white" />}
                {step.status === "current" && <Clock width={14} height={14} color="white" />}
                {step.status === "pending" && <Circle width={14} height={14} color="#8898aa" />}
              </View>
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.stepLine,
                    step.status === "completed" && styles.completedLine,
                    step.status === "current" && styles.currentLine,
                  ]}
                />
              )}
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
              {step.status === "current" && (
                <View style={styles.currentStatusBadge}>
                  <Text style={styles.currentStatusText}>Hozirda shu bo'limda</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f9fe",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#e6e9f0",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#32325d",
    marginBottom: 16,
  },
  timeline: {
    paddingLeft: 8,
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  stepIconContainer: {
    alignItems: "center",
    marginRight: 12,
  },
  stepIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  completedIconWrapper: {
    backgroundColor: "#2dce89",
  },
  currentIconWrapper: {
    backgroundColor: "#5e72e4",
  },
  pendingIconWrapper: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#8898aa",
  },
  stepLine: {
    position: "absolute",
    top: 24,
    width: 2,
    height: 30,
    backgroundColor: "#e6e9f0",
    zIndex: 0,
  },
  completedLine: {
    backgroundColor: "#2dce89",
  },
  currentLine: {
    backgroundColor: "#5e72e4",
  },
  stepContent: {
    flex: 1,
  },
  stepDepartment: {
    fontSize: 16,
    fontWeight: "600",
  },
  completedText: {
    color: "#2dce89",
  },
  currentText: {
    color: "#5e72e4",
  },
  pendingText: {
    color: "#8898aa",
  },
  stepDate: {
    fontSize: 14,
    color: "#8898aa",
    marginTop: 4,
  },
  currentStatusBadge: {
    backgroundColor: "rgba(94, 114, 228, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  currentStatusText: {
    fontSize: 12,
    color: "#5e72e4",
    fontWeight: "600",
  },
})

export default ItemJourney