import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LinearGradient from "react-native-linear-gradient"; // Changed import

type RootStackParamList = {
  AdminLogin: undefined;
  EmployeeLogin: undefined;
};

type StartScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const StartScreen = () => {
  const navigation = useNavigation<StartScreenNavigationProp>();

  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop" }}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']} // Same colors as before
        style={styles.container}
      >
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        <View style={styles.logoContainer}>

          <Text style={styles.title}>Tekstil Boshqaruv</Text>
          <Text style={styles.subtitle}>Ishlab chiqarish jarayonlarini samarali boshqarish tizimi</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => navigation.navigate("AdminLogin")}
          >
            <Text style={styles.adminButtonText}>Admin sifatida kirish</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.employeeButton}
            onPress={() => navigation.navigate("EmployeeLogin")}
          >
            <Text style={styles.employeeButtonText}>Xodim sifatida kirish</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>Versiya 1.0.0</Text>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 100
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 60,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 40,
  },
  adminButton: {
    backgroundColor: "#3498db",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  adminButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  employeeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  employeeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  version: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 20,
  },
});

export default StartScreen;