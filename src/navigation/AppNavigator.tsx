"use client"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useAuth } from "../context/AuthContext"
import StartScreen from "../screens/StartScreen"
import LoginScreen from "../screens/LoginScreen"
import DetailScreen from "../screens/DetailScreen"
import ProductTrackingScreen from "../screens/ProductTrackingScreen"
import DepartmentStatsScreen from "../screens/DepartmentStatsScreen"
import TabNavigator from "./TabNavigator"

const Stack = createNativeStackNavigator()

const AppNavigator = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return null // Or a loading screen
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Start" component={StartScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen
            name="Detail"
            component={DetailScreen}
            options={{
              headerShown: true,
              title: "Batafsil ma'lumot",
              headerTitleStyle: { color: "#333", fontWeight: "bold" },
              headerTintColor: "#3498db",
            }}
          />
          <Stack.Screen
            name="ProductTracking"
            component={ProductTrackingScreen}
            options={{
              headerShown: true,
              title: "Tovar haritasi",
              headerTitleStyle: { color: "#333", fontWeight: "bold" },
              headerTintColor: "#3498db",
            }}
          />
          <Stack.Screen
            name="DepartmentStats"
            component={DepartmentStatsScreen}
            options={{
              headerShown: true,
              title: "Bo'limlar statistikasi",
              headerTitleStyle: { color: "#333", fontWeight: "bold" },
              headerTintColor: "#3498db",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  )
}

export default AppNavigator
