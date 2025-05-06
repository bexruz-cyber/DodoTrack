// navigation/types.ts
import { RouteProp, CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Define the root stack param list
export type RootStackParamList = {
  Start: undefined;
  AdminLogin: undefined;
  EmployeeLogin: undefined;
  Main: { screen?: keyof TabParamList; params?: object };
  Detail: { itemId?: string; title?: string };
  ProductTracking: { productId?: string };
  DepartmentStats: { departmentId?: string };
  Home: undefined
};

// Define the tab navigator param list
export type TabParamList = {
  HomeTab: undefined;
  DashboardTab: undefined;
  ProfileTab: undefined;
  AdminTab: undefined;
};

// For use with useNavigation hook in stack screens
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// For use with useNavigation hook in tab screens
export type TabNavigationProp = BottomTabNavigationProp<TabParamList>;

// For use with useNavigation hook in tab screens that need to navigate to stack screens
export type CombinedNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

// For use with useRoute hook
export type RootRouteProps<RouteName extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  RouteName
>;

export type TabRouteProps<RouteName extends keyof TabParamList> = RouteProp<
  TabParamList,
  RouteName
>;