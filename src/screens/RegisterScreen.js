import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../firebase";
import { useTheme } from "../theme/ThemeContext";
import { emailPattern, passwordPattern } from "../utils/validation";

WebBrowser.maybeCompleteAuthSession();

const RegisterScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const colors =
    theme === "dark"
      ? {
          background: "#0F172A",
          text: "#E2E8F0",
          border: "#334155",
          caption: "#94A3B8",
        }
      : {
          background: "#FFFFFF",
          text: "#111827",
          border: "#D1D5DB",
          caption: "#6B7280",
        };

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "REPLACE_WITH_GOOGLE_WEB_CLIENT_ID",
    iosClientId: "REPLACE_WITH_GOOGLE_IOS_CLIENT_ID",
    androidClientId: "REPLACE_WITH_GOOGLE_ANDROID_CLIENT_ID",
    expoClientId: "REPLACE_WITH_GOOGLE_EXPO_CLIENT_ID",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          navigation.reset({ index: 0, routes: [{ name: "Home" }] });
        })
        .catch((error) => {
          Alert.alert(
            "Google Sign-in Failed",
            error.message || "Failed to login with Google.",
          );
        });
    }
  }, [response, navigation]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        data.email.trim(),
        data.password,
      );
      navigation.navigate("AccountSetup");
    } catch (error) {
      const message =
        error?.message || "Registration failed. Please try again.";
      Alert.alert("Registration Failed", message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
            <Text style={[styles.themeButtonText, { color: colors.text }]}>
              Switch to {theme === "light" ? "Dark" : "Light"} Mode
            </Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Create Account
            </Text>
            <Text style={[styles.subtitle, { color: colors.caption }]}>
              Sign up to get started
            </Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: emailPattern,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor:
                          theme === "dark" ? "#1E293B" : "#F9FAFB",
                        color: colors.text,
                        borderColor: errors.email ? "#EF4444" : colors.border,
                      },
                      errors.email && styles.inputError,
                    ]}
                    placeholder="Email"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={
                      theme === "dark" ? "#94A3B8" : "#9CA3AF"
                    }
                  />
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email.message}</Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{
                required: "Password is required",
                pattern: passwordPattern,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor:
                          theme === "dark" ? "#1E293B" : "#F9FAFB",
                        color: colors.text,
                        borderColor: errors.password
                          ? "#EF4444"
                          : colors.border,
                      },
                      errors.password && styles.inputError,
                    ]}
                    placeholder="Password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                    placeholderTextColor={
                      theme === "dark" ? "#94A3B8" : "#9CA3AF"
                    }
                  />
                  {errors.password && (
                    <Text style={styles.errorText}>
                      {errors.password.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor:
                          theme === "dark" ? "#1E293B" : "#F9FAFB",
                        color: colors.text,
                        borderColor: errors.confirmPassword
                          ? "#EF4444"
                          : colors.border,
                      },
                      errors.confirmPassword && styles.inputError,
                    ]}
                    placeholder="Confirm Password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                    placeholderTextColor={
                      theme === "dark" ? "#94A3B8" : "#9CA3AF"
                    }
                  />
                  {errors.confirmPassword && (
                    <Text style={styles.errorText}>
                      {errors.confirmPassword.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme === "dark" ? "#2563EB" : "#4F46E5" },
              ]}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.googleButton,
                { backgroundColor: theme === "dark" ? "#1C64F2" : "#DB4437" },
              ]}
              onPress={() => {
                if (!request) {
                  Alert.alert(
                    "Google auth not ready",
                    "Please try again in a moment.",
                  );
                  return;
                }
                promptAsync();
              }}
            >
              <Text style={styles.buttonText}>Continue with Google</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, { color: colors.caption }]}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text
                  style={[
                    styles.loginLink,
                    { color: theme === "dark" ? "#60A5FA" : "#4F46E5" },
                  ]}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: "#111827",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  button: {
    backgroundColor: "#4F46E5",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#4F46E5",
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#6B7280",
    fontSize: 14,
  },
  loginLink: {
    color: "#4F46E5",
    fontSize: 14,
    fontWeight: "bold",
  },
  themeButton: {
    alignSelf: "flex-end",
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(79,70,229,0.12)",
  },
  themeButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  googleButton: {
    marginTop: 10,
  },
});

export default RegisterScreen;
