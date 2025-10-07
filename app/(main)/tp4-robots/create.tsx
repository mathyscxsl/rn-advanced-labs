import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import RobotForm from "../../../components/RobotForm";

const CreateRobotScreen = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
      <RobotForm onSubmitSuccess={() => router.back()} />
    </View>
  );
};

export default CreateRobotScreen;
