import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(main)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const router = useRouter();
  const pathname = usePathname();
  const restoredOnceRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (restoredOnceRef.current) return;
      try {
        const saved = await AsyncStorage.getItem("__last_pathname__");
        if (isMounted && saved && saved !== pathname) {
          setTimeout(() => {
            try {
              router.replace(saved as any);
            } catch {}
          }, 0);
        }
      } catch {}
      restoredOnceRef.current = true;
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!pathname) return;
    AsyncStorage.setItem("__last_pathname__", pathname).catch(() => {});
  }, [pathname]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
