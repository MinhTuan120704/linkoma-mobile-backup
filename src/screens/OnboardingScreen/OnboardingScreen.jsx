import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OnboardingScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  
  const handleNext = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Image
        source={require("../../../assets/onboarding1.png")}
        style={styles.image}
      />
      <Text style={styles.title}>Welcome To Linkoma</Text>
      <Text style={styles.subtitle}>
        Your smart solution for apartment management.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Started</Text>
      </TouchableOpacity>
      <Text style={styles.skip} onPress={handleNext}>
        Skip
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: 300, height: 200, resizeMode: "contain" },
  title: { fontSize: 24, fontWeight: "bold", marginTop: 20 },
  subtitle: { fontSize: 16, textAlign: "center", marginVertical: 10 },
  button: {
    backgroundColor: "#1890ff",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    marginTop: 20,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
  skip: { marginTop: 20, color: "#888" },
});
