import { Stack, router } from "expo-router";
import { Platform, Text, TouchableOpacity } from "react-native";

export default function FormikLayout() {
  const handleBackPress = () => {
    router.replace("/(main)/");
  };

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        gestureEnabled: false,
        contentStyle: { backgroundColor: "#f0f0f0" },
        // Header bar in black
        headerStyle: { backgroundColor: "#000" },
        headerTransparent: false,
        headerShadowVisible: true,
        // Title in white for contrast
        headerTitleStyle: { color: "#fff" },
        // Tint default icons/buttons in blue
        headerTintColor: "#007AFF",
      }}
    >
      <Stack.Screen
        name="index"
        listeners={{
          beforeRemove: (e) => {
            const actionType = (e as any)?.data?.action?.type;
            if (actionType === "POP" || actionType === "GO_BACK") {
              e.preventDefault();
              router.replace("/(main)/");
            }
          },
        }}
        options={{
          title: "Robots",
          headerBackTitle: "Retour",
          headerLeft: () => (
            <TouchableOpacity
              onPress={handleBackPress}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginLeft: Platform.OS === "ios" ? -8 : 0,
              }}
              accessibilityLabel="Revenir à l'accueil"
            >
              <Text
                style={{
                  // Blue back text as originally on iOS, and for visibility on dark header on Android too
                  color: "#007AFF",
                  fontSize: 17,
                  fontWeight: Platform.OS === "ios" ? "400" : "bold",
                }}
              >
                {Platform.OS === "ios" ? "← Retour" : "← Accueil"}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
