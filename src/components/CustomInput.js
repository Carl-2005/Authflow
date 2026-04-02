import { useState } from "react";
import { Controller } from "react-hook-form";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const CustomInput = ({
  control,
  name,
  placeholder,
  rules = {},
  secureTextEntry = false,
  error,
  keyboardType = "default",
  autoCapitalize = "none",
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder={placeholder}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={secureTextEntry && !isPasswordVisible}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                placeholderTextColor="#9CA3AF"
              />
              {secureTextEntry && (
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <Text style={styles.eyeText}>
                    {isPasswordVisible ? "👁️" : "👁️‍🗨️"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 15,
  },
  inputContainer: {
    position: "relative",
    width: "100%",
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
  eyeButton: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  eyeText: {
    fontSize: 20,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
});

export default CustomInput;
