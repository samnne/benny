import Navbar from "@/components/Navigation/Navbar";
import { styled } from "nativewind";
import { SafeAreaView as RNSAV } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSAV);
const analytics = () => {
  return (
    <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: 16 }}>
      <Navbar />
    </SafeAreaView>
  );
};

export default analytics;
