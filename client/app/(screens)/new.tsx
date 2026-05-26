import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Link, useRouter } from "expo-router";
import { Image } from "expo-image";
import { styled } from "nativewind";
import { useRef, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSAV } from "react-native-safe-area-context";
import { useCamera, useReceipt, useTrip } from "@/store/zustand";

const SafeAreaView = styled(RNSAV);

const NewReceipt = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const { setSource } = useCamera();
  const { reset } = useTrip();
  const { setServerReceipt } = useReceipt();
  // Still loading
  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-background-dark items-center justify-center">
        <Text className="font-fredoka text-primary text-2xl">Loading...</Text>
      </SafeAreaView>
    );
  }

  // Permission not granted
  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-white  items-center justify-center px-8">
        <Image
          source={require("@/assets/icons/benny-camera.png")}
          style={{ width: 200, height: 200 }}
          contentFit="contain"
        />

        <Text className="font-fredoka text-4xl text-text  text-center mt-4">
          May Benny see the receipt?
        </Text>
        <Text className="font-nunito-medium text-base text-text/60 text-center mt-3 mx-6 leading-6">
          Allow Benny to access your camera. We use it only to parse receipts,
          nothing more!
        </Text>

        <Pressable
          onPress={requestPermission}
          className="mt-8 bg-primary dark:bg-primary-dark rounded-full px-10 py-4 "
        >
          <Text className="font-fredoka-semibold text-white text-xl tracking-wide">
            Allow Camera
          </Text>
        </Pressable>

        <View className="absolute bottom-10 items-center">
          <Text className="font-nunito text-xs text-text/40 ">
            View our{" "}
            <Link
              href="https://market-quad.com/privacy"
              className="text-primary dark:text-primary-dark"
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              href="https://market-quad.com/tos"
              className="text-primary dark:text-primary-dark"
            >
              Terms of Service
            </Link>
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Camera ready
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }
  async function handleCapture() {
    // Camera Capture Logic Save to Zustand State
    if (cameraRef.current) {
      const options = { quality: 1, base64: true };
      // const data = await cameraRef.current.takePictureAsync(options);
      // setSource(data.uri);

      router.push("/receipt/confirm");
    }
  }

  return (
    <View className="flex-1 justify-center bg-black">
      <CameraView ref={cameraRef} className="flex-1 " facing={facing} />

      {/* Controls overlay */}
      <TouchableOpacity
        onPress={() => {
          reset();
          setServerReceipt({});
          router.push("/(screens)/receipt/view");
        }}
        activeOpacity={0.8}
        className="absolute justify-center items-center top-20 right-5 rounded-full bg-primary px-4 py-2 "
      >
        <Text className="text-2xl text-white font-fredoka-semibold">
          Add Manually
        </Text>
      </TouchableOpacity>
      <SafeAreaView
        className="absolute bottom-0 left-0 right-0 pb-6 items-center gap-4"
        edges={["bottom"]}
      >
        {/* Shutter area */}
        <View className="flex-row items-center justify-center gap-10">
          {/* Flip */}
          <TouchableOpacity
            onPress={toggleCameraFacing}
            className="w-12 h-12 rounded-full bg-white/20 items-center justify-center"
          >
            <Text className="text-white text-xl">↺</Text>
          </TouchableOpacity>

          {/* Capture */}
          <TouchableOpacity
            className="w-20 h-20 rounded-full bg-white items-center justify-center"
            style={{
              shadowColor: "#fff",
              shadowOpacity: 0.3,
              shadowRadius: 12,
            }}
            onPress={() => handleCapture()}
          >
            <View className="w-16 h-16 rounded-full border-4 border-primary bg-white" />
          </TouchableOpacity>

          {/* Placeholder to balance the row */}
          <View className="w-12 h-12" />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default NewReceipt;
