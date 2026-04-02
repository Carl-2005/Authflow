import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";

const HomeScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const colors =
    theme === "dark"
      ? { background: "#0F172A", text: "#E2E8F0", caption: "#94A3B8" }
      : { background: "#FFFFFF", text: "#111827", caption: "#6B7280" };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
          <Text style={[styles.themeButtonText, { color: colors.text }]}>
            Switch to {theme === "light" ? "Dark" : "Light"} Mode
          </Text>
        </TouchableOpacity>

        <Text style={[styles.emoji, { color: colors.text }]}>🎉</Text>
        <Text style={[styles.title, { color: colors.text }]}>
          Welcome to Home!
        </Text>
        <Text style={[styles.subtitle, { color: colors.caption }]}>
          You have successfully completed the authentication flow.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#EF4444",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 40,
    shadowColor: "#EF4444",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  themeButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(79,70,229,0.12)",
  },
  themeButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export default HomeScreen;
