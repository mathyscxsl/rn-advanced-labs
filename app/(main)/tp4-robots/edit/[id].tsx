import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import RobotForm from "../../../../components/RobotForm";

const EditRobotScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  if (!id || typeof id !== "string") return null;

  return (
    <View style={{ flex: 1 }}>
      <RobotForm robotId={id} onSubmitSuccess={() => router.back()} />
    </View>
  );
};

export default EditRobotScreen;
