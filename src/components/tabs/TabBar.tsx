import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Users, Briefcase, Type, Tag } from "react-native-feather"
import LinearGradient from "react-native-linear-gradient"

interface TabBarProps {
  activeTab: "users" | "departments" | "colors" | "sizes"
  setActiveTab: (tab: "users" | "departments" | "colors" | "sizes") => void
}

const TabBar = ({ activeTab, setActiveTab }: TabBarProps) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "users" && styles.activeTab]}
        onPress={() => setActiveTab("users")}
        activeOpacity={0.7}
      >
        {activeTab === "users" ? (
          <LinearGradient
            colors={['#5e72e4', '#324cdd']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.tabGradient}
          >
            <Users width={20} height={20} color="white" />
            <Text style={styles.activeTabText}>Xodimlar</Text>
          </LinearGradient>
        ) : (
          <View style={styles.tabContent}>
            <Users width={20} height={20} color="#8898aa" />
            <Text style={styles.tabText}>Xodimlar</Text>
          </View>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === "departments" && styles.activeTab]}
        onPress={() => setActiveTab("departments")}
        activeOpacity={0.7}
      >
        {activeTab === "departments" ? (
          <LinearGradient
            colors={['#5e72e4', '#324cdd']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.tabGradient}
          >
            <Briefcase width={20} height={20} color="white" />
            <Text style={styles.activeTabText}>Bo'limlar</Text>
          </LinearGradient>
        ) : (
          <View style={styles.tabContent}>
            <Briefcase width={20} height={20} color="#8898aa" />
            <Text style={styles.tabText}>Bo'limlar</Text>
          </View>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === "colors" && styles.activeTab]}
        onPress={() => setActiveTab("colors")}
        activeOpacity={0.7}
      >
        {activeTab === "colors" ? (
          <LinearGradient
            colors={['#5e72e4', '#324cdd']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.tabGradient}
          >
            <Type width={20} height={20} color="white" />
            <Text style={styles.activeTabText}>Ranglar</Text>
          </LinearGradient>
        ) : (
          <View style={styles.tabContent}>
            <Type width={20} height={20} color="#8898aa" />
            <Text style={styles.tabText}>Ranglar</Text>
          </View>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === "sizes" && styles.activeTab]}
        onPress={() => setActiveTab("sizes")}
        activeOpacity={0.7}
      >
        {activeTab === "sizes" ? (
          <LinearGradient
            colors={['#5e72e4', '#324cdd']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.tabGradient}
          >
            <Tag width={20} height={20} color="white" />
            <Text style={styles.activeTabText}>O'lchamlar</Text>
          </LinearGradient>
        ) : (
          <View style={styles.tabContent}>
            <Tag width={20} height={20} color="#8898aa" />
            <Text style={styles.tabText}>O'lchamlar</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 6,
  },
  tab: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  activeTab: {
    shadowColor: "#5e72e4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tabGradient: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  tabContent: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    marginTop: 4,
    color: "#8898aa",
    fontSize: 12,
    fontWeight: "500",
  },
  activeTabText: {
    marginTop: 4,
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
})

export default TabBar