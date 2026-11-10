import { theme } from "@/constants/constants";
import { isReceiptImage } from "@/services/ocr";
// Previous TensorFlow model check:
// import { isReceiptImage } from "@/services/model";
import { useCamera, useReceipt, useTrip } from "@/store/zustand";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { styled } from "nativewind";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView as RNSAV } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSAV);

const NewReceipt = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const { setSource, setBlob } = useCamera();
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
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-8">
        <Image
          source={require("@/assets/icons/benny-camera.png")}
          style={{ width: 200, height: 200 }}
          contentFit="contain"
        />

        <Text className="font-fredoka text-4xl text-text text-center mt-4">
          May Benny see the receipt?
        </Text>
        <Text className="font-nunito-medium text-base text-text/60 text-center mt-3 mx-6 leading-6">
          Allow Benny to access your camera. We use it only to parse receipts,
          nothing more!
        </Text>

        <Pressable
          onPress={requestPermission}
          className="mt-8 bg-primary dark:bg-primary-dark rounded-full px-10 py-4"
        >
          <Text className="font-fredoka-semibold text-white text-xl tracking-wide">
            Allow Camera
          </Text>
        </Pressable>

        <View className="absolute bottom-10 items-center">
          <Text className="font-nunito text-xs text-text/40">
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
    if (cameraRef.current && !isProcessing) {
      setIsProcessing(true);
      try {
        const options = { quality: 1, base64: true };
        const data = await cameraRef.current.takePictureAsync(options);

        if (!data?.uri) {
          setIsProcessing(false);
          return;
        }

        setSource(data.uri);
        const blob = await fetch(data.uri).then((res) => res.blob());
        setBlob(blob);

        // Validate captured photo using TFLite receipt classifier model
        const check = await isReceiptImage(data.uri);
        if (!check.isReceipt) {
          Alert.alert(
            "Receipt Not Detected",
            "Benny couldn't clearly recognize a receipt in this photo. Would you like to retake or use it anyway?",
            [
              {
                text: "Retake",
                style: "cancel",
                onPress: () => setIsProcessing(false),
              },
              {
                text: "Use Anyway",
                onPress: () => {
                  setIsProcessing(false);
                  router.push("/receipt/confirm");
                },
              },
            ],
          );
          return;
        }

        setIsProcessing(false);
        router.push("/receipt/confirm");
      } catch (err) {
        console.error("Camera capture / classification error:", err);
        setIsProcessing(false);
        router.push("/receipt/confirm");
      }
    }
  }

  return (
    <View className="flex-1 justify-center bg-black">
      <CameraView
        ref={cameraRef}
        className="flex-1"
        style={StyleSheet.absoluteFill}
        facing={facing}
      />

      {/* Top overlay with back button & Add Manually pill */}
      <SafeAreaView
        className="absolute top-0 left-0 right-0 p-4 flex-row justify-between items-center z-10"
        edges={["top"]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-black/40 border border-white/20 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <SymbolView name="xmark" tintColor="#ffffff" size={18} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            reset();
            const todayDate = new Date().toISOString().split("T")[0];
            setServerReceipt({
              merchant: { name: "", address: null },
              date: todayDate,
              currency: "CAD",
              discounts: null,
              items: [],
              subtotal: 0,
              tax: 0,
              tip: 0,
              total: 0,
              category: "other",
              confidence: "high",
              benny_message: "",
              payment_method: null,
              time: null,
            } as unknown as Receipt);
            router.push("/(screens)/receipt/view");
          }}
          activeOpacity={0.8}
          className="rounded-full bg-primary px-4 py-2 flex-row items-center gap-1.5 shadow"
        >
          <Text className="text-lg text-white font-fredoka-semibold">
            Add Manually
          </Text>
          <SymbolView name="square.and.pencil" tintColor="#ffffff" size={16} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Viewfinder Overlay Guide */}
      <View className="absolute inset-0 justify-center items-center pointer-events-none px-6">
        <View className="w-full h-3/5 border-2 border-dashed border-white/60 rounded-3xl justify-center items-center relative overflow-hidden">
          {/* Corner Guides */}
          <View className="absolute top-3 left-3 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
          <View className="absolute top-3 right-3 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
          <View className="absolute bottom-3 left-3 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
          <View className="absolute bottom-3 right-3 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />

          <View className="bg-black/60 px-4 py-2 rounded-full border border-white/20">
            <Text className="text-white font-nunito-semibold text-xs text-center">
              Align receipt within frame
            </Text>
          </View>
        </View>
      </View>

      {/* Shutter Bar Controls */}
      <SafeAreaView
        className="absolute bottom-0 left-0 right-0 pb-6 items-center gap-4 z-10"
        edges={["bottom"]}
      >
        <View className="flex-row items-center justify-center gap-10">
          {/* Flip Camera */}
          <TouchableOpacity
            onPress={toggleCameraFacing}
            className="w-12 h-12 rounded-full bg-black/40 border border-white/20 items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="Flip camera"
          >
            <SymbolView
              name="arrow.triangle.2.circlepath"
              tintColor="#ffffff"
              size={22}
            />
          </TouchableOpacity>

          {/* Shutter Button */}
          <TouchableOpacity
            disabled={isProcessing}
            className="w-20 h-20 rounded-full bg-white items-center justify-center shadow-lg"
            onPress={() => void handleCapture()}
            accessibilityRole="button"
            accessibilityLabel="Take photo"
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <View className="w-16 h-16 rounded-full border-4 border-primary bg-white" />
            )}
          </TouchableOpacity>

          {/* Spacer */}
          <View className="w-12 h-12" />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default NewReceipt;