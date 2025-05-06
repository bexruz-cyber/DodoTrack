import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { View, StyleSheet, Animated, Platform } from "react-native"
import { Home, User, BarChart2, Settings, Map } from "react-native-feather"
import { useAuth } from "../context/AuthContext"
import HomeScreen from "../screens/HomeScreen"
import ProfileScreen from "../screens/ProfileScreen"
import DashboardScreen from "../screens/DashboardScreen"
import AdminScreen from "../screens/AdminScreen"
import ProductTrackingScreen from "../screens/ProductTrackingScreen"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRef, useEffect } from "react"
import DepartmentStatsScreen from "../screens/DepartmentStatsScreen"

type TabParamList = {
  DashboardTab: undefined;
  ProductTrackingTab: undefined;
  HomeTab: undefined;
  ProfileTab: undefined;
  AdminTab: undefined;
  DepartmentStatsTab: undefined

};

const Tab = createBottomTabNavigator<TabParamList>()

const TabNavigator = () => {
  const { user } = useAuth()
  const insets = useSafeAreaInsets()

  // Custom tab bar icon with animation
  const TabIcon = ({
    size,
    icon: Icon,
    focused,
    isHome = false
  }: {
    color: string;
    size: number;
    icon: any;
    focused: boolean;
    isHome?: boolean;
  }) => {
    const scaleValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      if (focused) {
        Animated.spring(scaleValue, {
          toValue: 1.2,
          friction: 5,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }).start();
      }
    }, [focused]);

    if (isHome) {
      return (
        <View style={styles.homeIconWrapper}>
          <View style={[styles.homeIconContainer, focused && styles.homeIconContainerActive]}>
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              <Icon stroke={focused ? "#ffffff" : "#ffffff"} width={size + 4} height={size + 4} />
            </Animated.View>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.tabIconContainer, focused && styles.tabIconContainerActive]}>
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <Icon stroke={focused ? "#ffffff" : "#8898aa"} width={size} height={size} />
        </Animated.View>
      </View>
    );
  };

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        tabBarStyle: {
          ...styles.tabBar,
          height: 65 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: "#5e72e4",
        tabBarInactiveTintColor: "#8898aa",
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} size={22} icon={BarChart2} focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="ProductTrackingTab"
        component={ProductTrackingScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} size={22} icon={Map} focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} size={26} icon={Home} focused={focused} isHome={true} />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} size={22} icon={User} focused={focused} />
          ),
        }}
      />

      {user?.role === "admin" ? (
        <Tab.Screen
          name="AdminTab"
          component={AdminScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabIcon color={color} size={22} icon={Settings} focused={focused} />
            ),
          }}
        />
      ) :
        (
          <Tab.Screen
            name="DepartmentStatsTab"
            component={DepartmentStatsScreen}
            options={{
              tabBarIcon: ({ color, focused }) => (
                <TabIcon color={color} size={22} icon={Settings} focused={focused} />
              ),
            }}
          />
        )
      }
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    position: "absolute",
    bottom: 0,
    paddingTop: 12,
    borderTopWidth: 0,
  },
  tabIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconContainerActive: {
    backgroundColor: "#5e72e4",
    shadowColor: "#5e72e4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  homeIconWrapper: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  homeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#5e72e4",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5e72e4",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  homeIconContainerActive: {
    backgroundColor: "#324cdd",
    shadowOpacity: 0.6,
  },
})

export default TabNavigator