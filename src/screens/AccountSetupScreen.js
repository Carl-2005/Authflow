import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import CustomInput from "../components/CustomInput";
import { useTheme } from "../theme/ThemeContext";

const AccountSetupScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const colors =
    theme === "dark"
      ? { background: "#0F172A", text: "#E2E8F0", caption: "#94A3B8" }
      : { background: "#FFFFFF", text: "#111827", caption: "#6B7280" };

  const [profileImage, setProfileImage] = useState(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to upload a photo.",
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const onSubmit = (data) => {
    if (!profileImage) {
      Alert.alert("Missing Photo", "Please upload a profile photo");
      return;
    }

    console.log("Account Setup Data:", {
      ...data,
      profileImage,
    });

    Alert.alert(
      "Profile Complete!",
      `Welcome ${data.firstName} ${data.lastName}!`,
      [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home"),
        },
      ],
    );
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
              Complete Your Profile
            </Text>
            <Text style={[styles.subtitle, { color: colors.caption }]}>
              Just a few more details
            </Text>
          </View>

          <View style={styles.form}>
            {/* Profile Photo Section */}
            <View style={styles.photoSection}>
              <TouchableOpacity
                style={styles.photoContainer}
                onPress={pickImage}
              >
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.placeholderPhoto}>
                    <Text style={styles.photoIcon}>📷</Text>
                    <Text style={styles.photoText}>Add Photo</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={pickImage}>
                <Text style={styles.changePhotoText}>
                  {profileImage ? "Change Photo" : "Upload Photo"}
                </Text>
              </TouchableOpacity>
            </View>

            <CustomInput
              control={control}
              name="firstName"
              placeholder="First Name"
              rules={{
                required: "First name is required",
                minLength: {
                  value: 2,
                  message: "First name must be at least 2 characters",
                },
                pattern: {
                  value: /^[A-Za-z]+$/,
                  message: "First name should contain only letters",
                },
              }}
              error={errors.firstName}
              autoCapitalize="words"
            />

            <CustomInput
              control={control}
              name="lastName"
              placeholder="Last Name"
              rules={{
                required: "Last name is required",
                minLength: {
                  value: 2,
                  message: "Last name must be at least 2 characters",
                },
                pattern: {
                  value: /^[A-Za-z]+$/,
                  message: "Last name should contain only letters",
                },
              }}
              error={errors.lastName}
              autoCapitalize="words"
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.buttonText}>Complete Setup</Text>
            </TouchableOpacity>
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
    fontSize: 28,
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
  photoSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  photoContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#4F46E5",
  },
  placeholderPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
  },
  photoIcon: {
    fontSize: 40,
    marginBottom: 5,
  },
  photoText: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "500",
  },
  changePhotoText: {
    color: "#4F46E5",
    fontSize: 14,
    fontWeight: "bold",
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
});

export default AccountSetupScreen;
