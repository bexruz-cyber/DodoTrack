import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  Dimensions,
  SafeAreaView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LinearGradient from "react-native-linear-gradient";
import { ArrowRight, Layers, Clock } from "react-native-feather";

type RootStackParamList = {
  Login: undefined;
};

type StartScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get("window");

const StartScreen = () => {
  const navigation = useNavigation<StartScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop" }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,20,60,0.75)", "rgba(0,30,70,0.95)"]}
          locations={[0, 0.6, 1]}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <View style={styles.logoWrapper}>
                <Layers width={60} height={60} color="#FFFFFF" style={styles.logoIcon} />
                <Text style={styles.title}>Tekstil Boshqaruv</Text>
              </View>
              <Text style={styles.subtitle}>
                Ishlab chiqarish jarayonlarini{"\n"}samarali boshqarish tizimi
              </Text>
            </View>

            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Layers width={24} height={24} color="#3498db" />
                </View>
                <Text style={styles.featureText}>Ishlab chiqarishni kuzatish</Text>
              </View>
              
              <View style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Clock width={24} height={24} color="#3498db" />
                </View>
                <Text style={styles.featureText}>Real vaqt boshqaruvi</Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.startButtonText}>Boshlash</Text>
                <ArrowRight width={20} height={20} color="#FFFFFF" />
              </TouchableOpacity>
              
              <View style={styles.versionContainer}>
                <Text style={styles.versionText}>v1.0.0</Text>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradient: {
    flex: 1,
    justifyContent: "space-between",
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 40,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: height * 0.05,
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },
  logoIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.85)",
    textAlign: "center",
    lineHeight: 24,
  },
  featuresContainer: {
    marginTop: height * 0.08,
    alignItems: "center",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: "100%",
  },
  featureIconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 10,
    borderRadius: 10,
    marginRight: 14,
  },
  featureText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  buttonContainer: {
    width: "100%",
    marginTop: height * 0.05,
    marginBottom: 32,
  },
  startButton: {
    backgroundColor: "#3498db",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    flexDirection: "row",
    justifyContent: "center",
  },
  startButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginRight: 10,
  },
  versionContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  versionText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 14,
  }
});

export default StartScreen;