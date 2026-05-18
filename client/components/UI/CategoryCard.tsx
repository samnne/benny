import { View, Text } from "react-native";
import React from "react";
import { SymbolView } from "expo-symbols";
import { theme } from "@/constants/constants";

type Category = {
  id: number;
  name: string;
  icon: string;
  budget: number;
  spent: number;
  subCategories?: { name: string; budget: number; spent: number }[];
};

const CategoryCard = ({ cat }: { cat: Category }) => {
  const leftToSpend = cat.budget - cat.spent;
  const progress = Math.min(cat.spent / cat.budget, 1);

  return (
    <View className="bg-white rounded-2xl p-4 gap-4 shadow-sm w-full">
      
      {/* Header Row */}
      <View className="flex-row items-center gap-3">
        <View className="bg-primary/10 rounded-xl p-3">
          <SymbolView
            name={cat.icon}
            size={24}
            tintColor={theme.colors.primary}
          />
        </View>
        <Text className="flex-1 text-base text-text/60">{cat.name}</Text>
        <Text className="text-base text-text/60">${cat.budget}</Text>
      </View>

      {/* Divider */}
      <View className="h-px bg-gray-100" />

      {/* Sub-rows */}
      {cat.subCategories?.map((sub, i) => {
        const subLeft = sub.budget - sub.spent;
        const subProgress = Math.min(sub.spent / sub.budget, 1);

        return (
          <View key={i} className="gap-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-bold text-text">{sub.name}</Text>
              <Text className="text-base font-bold text-text">${sub.spent}</Text>
            </View>

            {/* Progress Bar */}
            <View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-primary rounded-full"
                style={{ width: `${subProgress * 100}%` }}
              />
            </View>

            <Text className="text-sm text-text/50 text-right">
              Left ${subLeft}
            </Text>

            {/* Divider between sub-rows */}
            {i < (cat.subCategories?.length ?? 0) - 1 && (
              <View className="h-px bg-gray-100 mt-1" />
            )}
          </View>
        );
      })}
    </View>
  );
};

export default CategoryCard;