import { Stack, router } from "expo-router";
import { Platform, Text, TouchableOpacity } from "react-native";

export default function DetailLayout() {
  const handleBackPress = () => {
    router.replace("/(main)/");
  };

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          title: "Détail",
          headerBackTitle: "Retour",
          headerLeft: () => (
            <TouchableOpacity
              onPress={handleBackPress}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginLeft: Platform.OS === "ios" ? -8 : 0,
              }}
            >
              <Text
                style={{
                  color: Platform.OS === "ios" ? "#007AFF" : "#000",
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
