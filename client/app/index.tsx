import { auth } from "@/config/firebase";
import { BASE_URL } from "@/constants/constants";
import { useAuth } from "@/store/zustand";
import { Link, Redirect, useFocusEffect, useRouter } from "expo-router";

import { KeyboardAvoidingView, Text, View } from "react-native";

export default function Index() {
  const { token, setToken } = useAuth();
  const {currentUser} = auth;
  useFocusEffect(() => {
    const func = async () => {
      const response = await fetch(`${BASE_URL}/`, {
        method: "get",
      });

      setToken(response.headers.get("X-Request-ID") || "");
    };
    func();
  });
  if (currentUser){
    return <Redirect href={"/home"}  />
  }
  return (
    <KeyboardAvoidingView
    behavior="padding" 
      className="flex-1 justify-center items-center ">
      <Link href={"/(screens)/onboarding/"}>
        <Text>Edit app/index.tsx to edit this screen. {token}</Text>
      </Link>
    </KeyboardAvoidingView>
  );
}
