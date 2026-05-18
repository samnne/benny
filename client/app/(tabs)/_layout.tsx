import React from "react";

import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { theme } from "@/constants/constants";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";

const TabsLayout = () => {
  return (
    <NativeTabs labelVisibilityMode="unlabeled">
      <NativeTabs.Trigger name="home">
        <Label hidden />
        <Icon selectedColor={theme.colors.primary} sf="house.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="receipts">
        <Label hidden />

        <Icon selectedColor={theme.colors.primary} sf="receipt" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Label hidden />

        <Icon selectedColor={theme.colors.primary} sf="gear" />
      </NativeTabs.Trigger>
      
    </NativeTabs>
  );
};

export default TabsLayout;
