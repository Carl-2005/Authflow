import { Colors } from "@/constants/theme";
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import { useColorScheme } from "react-native";

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
  colors: Colors.light,
});

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme() ?? "light";
  const [theme, setTheme] = useState(systemScheme);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      colors: Colors[theme] || Colors.light,
    }),
    [theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
