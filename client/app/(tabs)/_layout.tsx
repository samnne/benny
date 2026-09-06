import { theme } from "@/constants/constants";
import { NativeTabs } from "expo-router/unstable-native-tabs";

const TabsLayout = () => {
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
