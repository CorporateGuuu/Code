import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useThemeColor } from "../../hooks/use-theme-color";
import { ThemedView } from "../../components/themed-view";

export default function HomeScreen({ navigation }) {
  const textColor = useThemeColor({}, 'text');

  const styles = createStyles(textColor);

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PostCarousel')}
      >
        <Text style={styles.buttonText}>View Dare Cards Carousel</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const createStyles = (textColor) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    color: textColor,
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
