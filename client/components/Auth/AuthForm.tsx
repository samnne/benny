import { View, Text } from "react-native";
import React from "react";

const AuthForm = ({ type }: { type: string }) => {
  return (
    <View>
      <Text>AuthForm {type}</Text>
    </View>
  );
};

export default AuthForm;
