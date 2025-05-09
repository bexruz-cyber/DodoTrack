import React, { useEffect, useRef } from "react"
import { View, StyleSheet, Animated, Easing } from "react-native"

interface SkeletonCardProps {
  count: number
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ count = 3 }) => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.timing(shimmerAnimation, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    )

    shimmer.start()

    return () => {
      shimmer.stop()
    }
  }, [])

  const shimmerTranslate = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  })

  const renderSkeletonCard = () => {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.department}>
            <View style={[styles.shimmer, styles.smallText]} />
            <View style={[styles.shimmer, styles.mediumText]} />
          </View>
          <View style={styles.department}>
            <View style={[styles.shimmer, styles.smallText]} />
            <View style={[styles.shimmer, styles.mediumText]} />
          </View>
        </View>
        <View style={styles.content}>
          <View style={[styles.shimmer, styles.largeText]} />
          <View style={styles.countContainer}>
            <View style={[styles.shimmer, styles.smallText, { width: 80 }]} />
            <View style={[styles.shimmer, styles.mediumText, { width: 40 }]} />
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.shimmer, styles.progressFill]} />
            </View>
            <View style={[styles.shimmer, styles.smallText, { width: 80 }]} />
          </View>
        </View>

        <Animated.View
          style={[
            styles.shimmerOverlay,
            {
              transform: [{ translateX: shimmerTranslate }],
            },
          ]}
        />
      </View>
    )
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={{ marginBottom: 16 }}>
          {renderSkeletonCard()}
        </View>
      ))}
    </>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  department: {
    flex: 1,
  },
  content: {
    padding: 12,
  },
  countContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    marginRight: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    width: "60%",
    borderRadius: 3,
  },
  shimmer: {
    backgroundColor: "#EEEEEE",
    borderRadius: 4,
    overflow: "hidden",
  },
  smallText: {
    height: 12,
    marginBottom: 4,
    width: "70%",
  },
  mediumText: {
    height: 16,
    width: "90%",
  },
  largeText: {
    height: 20,
    width: "80%",
    marginBottom: 8,
  },
  shimmerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    width: 100,
    transform: [{ skewX: "-20deg" }],
  },
})

export default SkeletonCard
