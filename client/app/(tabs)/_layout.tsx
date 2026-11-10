import { theme } from "@/constants/constants";
import { useFonts } from "expo-font";
import { NativeTabs } from 'expo-router/native-tabs';
import { useEffect } from "react";

const TabsLayout = () => {
  const [fontsLoaded, fontError] = useFonts({
      "Fredoka-Bold": require("@/assets/fonts/Fredoka-Bold.ttf"),
      "Fredoka-Light": require("@/assets/fonts/Fredoka-Light.ttf"),
      "Fredoka-Medium": require("@/assets/fonts/Fredoka-Medium.ttf"),
      "Fredoka-Regular": require("@/assets/fonts/Fredoka-Regular.ttf"),
      "Fredoka-SemiBold": require("@/assets/fonts/Fredoka-SemiBold.ttf"),
      "Nunito-Black": require("@/assets/fonts/Nunito-Black.ttf"),
      "Nunito-Bold": require("@/assets/fonts/Nunito-Bold.ttf"),
      "Nunito-ExtraBold": require("@/assets/fonts/Nunito-ExtraBold.ttf"),
      "Nunito-ExtraLight": require("@/assets/fonts/Nunito-ExtraLight.ttf"),
      "Nunito-Light": require("@/assets/fonts/Nunito-Light.ttf"),
      "Nunito-Medium": require("@/assets/fonts/Nunito-Medium.ttf"),
      "Nunito-Regular": require("@/assets/fonts/Nunito-Regular.ttf"),
      "Nunito-SemiBold": require("@/assets/fonts/Nunito-SemiBold.ttf"),
    });
    
    useEffect(()=>{
      if(fontError){
        console.log("Font error", fontError)
      }
    }, [fontError])
   
  return (
    <NativeTabs labelVisibilityMode="unlabeled">
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label hidden />
        <NativeTabs.Trigger.Icon
          selectedColor={theme.colors.primary}
          sf="house.fill"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="receipts">
        <NativeTabs.Trigger.Label hidden />

        <NativeTabs.Trigger.Icon
          selectedColor={theme.colors.primary}
          sf="receipt"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="analytics">
        <NativeTabs.Trigger.Label hidden />

        <NativeTabs.Trigger.Icon
          selectedColor={theme.colors.primary}
          sf="chart.bar"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label hidden />

        <NativeTabs.Trigger.Icon
          selectedColor={theme.colors.primary}
          sf="gear"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default TabsLayout;
