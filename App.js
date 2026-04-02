import { Colors } from "@/constants/theme";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { registerRootComponent } from "expo";
import AccountSetupScreen from "./src/screens/AccountSetupScreen";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";

const Stack = createNativeStackNavigator();

function ThemedApp() {
  const { theme } = useTheme();
  const colorScheme = Colors[theme] || Colors.light;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme.tint,
          },
          headerTintColor: theme === "light" ? "#fff" : "#000",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: "Create Account" }}
        />
        <Stack.Screen
          name="AccountSetup"
          component={AccountSetupScreen}
          options={{
            title: "Setup Your Profile",
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "Home",
            headerLeft: () => null,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

registerRootComponent(App);
