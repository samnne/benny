import { BASE_URL } from "@/constants/constants";
import { useAuth } from "@/store/zustand";
import { Link, useFocusEffect } from "expo-router";

import { Text, View } from "react-native";

export default function Index() {
  const { token, setToken } = useAuth();
  useFocusEffect(() => {
    const func = async () => {
      const response = await fetch(`${BASE_URL}/`, {
        method: "get",
      }).then((res) => res.json());
      
      setToken(response.token);
    };
    func();
  });

  return (
    <View className="flex-1 justify-center items-center ">
      <Link href={"/(screens)/onboarding/"}>
        <Text>
          Edit app/index.tsx to edit this screen. 
        </Text>
      </Link>
    </View>
  );
}
