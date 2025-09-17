import * as Haptics from "expo-haptics";
import { Stack, router } from "expo-router";
import { Platform, Text, TouchableOpacity } from "react-native";

export default function FormikLayout() {
  const handleBackPress = () => {
    router.replace("/(main)/");
  };

  const handleSwitchToRHF = () => {
    Haptics.selectionAsync();
    router.replace("/(main)/tp3-forms/rhf");
  };

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        gestureEnabled: false,
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
          title: "Formulaire (Formik)",
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
                  color: Platform.OS === "ios" ? "#007AFF" : "#000",
                  fontSize: 17,
                  fontWeight: Platform.OS === "ios" ? "400" : "bold",
                }}
              >
                {Platform.OS === "ios" ? "← Retour" : "← Accueil"}
              </Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={handleSwitchToRHF}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginRight: Platform.OS === "ios" ? -8 : 0,
              }}
              accessibilityLabel="Basculer vers le formulaire RHF"
            >
              <Text
                style={{
                  color: Platform.OS === "ios" ? "#007AFF" : "#000",
                  fontSize: 17,
                  fontWeight: Platform.OS === "ios" ? "400" : "bold",
                }}
              >
                ⇄ RHF
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
