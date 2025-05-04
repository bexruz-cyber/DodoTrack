"use client"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { View, StyleSheet } from "react-native"
import { Home, User, BarChart2, Settings } from "react-native-feather"
import { useAuth } from "../context/AuthContext"
import HomeScreen from "../screens/HomeScreen"
import ProfileScreen from "../screens/ProfileScreen"
import DashboardScreen from "../screens/DashboardScreen"
import AdminScreen from "../screens/AdminScreen"

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  const { user } = useAuth()

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#3498db",
        tabBarInactiveTintColor: "#95a5a6",
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={styles.tabItem}>
              <Home stroke={color} width={size} height={size} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={styles.tabItem}>
              <BarChart2 stroke={color} width={size} height={size} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={styles.tabItem}>
              <User stroke={color} width={size} height={size} />
            </View>
          ),
        }}
      />
      {user?.role === "admin" && (
        <Tab.Screen
          name="AdminTab"
          component={AdminScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <View style={styles.tabItem}>
                <Settings stroke={color} width={size} height={size} />
              </View>
            ),
          }}
        />
      )}
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    position: "absolute",
    bottom: 0,
    paddingTop: 15
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
})

export default TabNavigator
