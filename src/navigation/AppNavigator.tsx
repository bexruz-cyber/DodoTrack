import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useAuth } from '../context/AuthContext'
import TabNavigator from './TabNavigator'
import StartScreen from '../screens/Start/StartScreen'
import AdminLoginScreen from '../screens/Auth/Login'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ProductTrackingScreen from '../screens/Dashboards/ProductTrackingScreen'
import DepartmentStatsScreen from '../screens/Dashboards/DepartmentStatsScreen'
import DetailScreen from '../screens/Home/DetailScreen'

// Define the stack navigator param list
export type RootStackParamList = {
  Start: undefined;
  Login: undefined;
  EmployeeLogin: undefined;
  Main: undefined;
  ProductTracking: undefined;
  DepartmentStats: undefined;
  Detail: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>()

const AppNavigator = () => {
  const { user, isLoading } = useAuth()

  // Show loading indicator while checking authentication status
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#5e72e4" />
      </View>
    )
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="ProductTracking" component={ProductTrackingScreen} />
          <Stack.Screen name="DepartmentStats" component={DepartmentStatsScreen} />
          <Stack.Screen name="Detail" component={DetailScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Start" component={StartScreen} />
          <Stack.Screen name="Login" component={AdminLoginScreen} />
        </>
      )}
    </Stack.Navigator>
  )
}

export default AppNavigator