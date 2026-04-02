import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
    GoogleAuthProvider,
    signInWithCredential,
    signInWithEmailAndPassword,
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
import { emailPattern } from "../utils/validation";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
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
          navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          });
        })
        .catch((error) => {
          Alert.alert(
            "Google Sign-in Failed",
            error.message || "Failed to login with Google.",
          );
        });
    }
  }, [response]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email.trim(), data.password);
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      const message = error?.message || "Unable to sign in. Please try again.";
      Alert.alert("Login Failed", message);
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
              Welcome Back!
            </Text>
            <Text style={[styles.subtitle, { color: colors.caption }]}>
              Sign in to continue
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
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
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

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme === "dark" ? "#2563EB" : "#4F46E5" },
              ]}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.buttonText}>Login</Text>
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

            <View style={styles.registerContainer}>
              <Text style={[styles.registerText, { color: colors.caption }]}>
                Don&apos;t have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text
                  style={[
                    styles.registerLink,
                    { color: theme === "dark" ? "#60A5FA" : "#4F46E5" },
                  ]}
                >
                  Sign Up
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
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerText: {
    color: "#6B7280",
    fontSize: 14,
  },
  registerLink: {
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

export default LoginScreen;
