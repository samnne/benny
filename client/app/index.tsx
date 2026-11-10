import { auth } from "@/config/firebase";
import { BASE_URL } from "@/constants/constants";
import { useAuth } from "@/store/zustand";
import { Link, Redirect, useFocusEffect, useRouter } from "expo-router";

import { KeyboardAvoidingView, Text, View } from "react-native";

export default function Index() {
  const { token, setToken } = useAuth();
  const { currentUser } = auth;
  const func = async () => {
    if (!currentUser) {
      return;
    }
    const response = await currentUser.getIdToken();
    if (response) {
      setToken(response);
    }
  };
  useFocusEffect(() => {
    func();
  });
  if (currentUser) {
    return <Redirect href={"/home"} />;
  } else {
    return <Redirect href={"/(screens)/(auth)/login"} />;
  }
}
