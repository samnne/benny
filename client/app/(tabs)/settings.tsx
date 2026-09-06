import Navbar from "@/components/Navigation/Navbar";
import { auth } from "@/config/firebase";
import { Link, router } from "expo-router";
import { Text } from "moti";
import { styled } from "nativewind";
import { Pressable } from "react-native";
import { SafeAreaView as RNSAV } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSAV);

const Settings = () => {
  return (
    <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: 16 }}>
      <Navbar />
      <Link href={"/"}>Settings</Link>
      <Pressable
        onPress={() => {
          auth.signOut();
          router.replace("/(screens)/onboarding");
        }}
      >
        <Text>Hey Queen Sign me OUT!</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Settings;
