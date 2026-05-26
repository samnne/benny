import React from "react";
import { View } from "react-native";
import SkeletonPulse from "../SkeletonPulse";

const ReceiptViewSkeleton = () => {
  return (
    <View className="flex-1 p-4 gap-6">
      {/* Merchant name + total */}
      <View className="gap-3">
        <SkeletonPulse style={{ width: "60%", height: 48, borderRadius: 12 }} />
        <View className="self-end">
          <SkeletonPulse style={{ width: 120, height: 48, borderRadius: 12 }} />
        </View>
        {/* Progress bar */}
        <SkeletonPulse style={{ width: "100%", height: 16, borderRadius: 99 }} />
        <View className="flex-row justify-between">
          <SkeletonPulse style={{ width: 24, height: 16, borderRadius: 4 }} />
          <SkeletonPulse style={{ width: 40, height: 16, borderRadius: 4 }} />
        </View>
      </View>

      {/* List heading */}
      <SkeletonPulse style={{ width: 80, height: 36, borderRadius: 10 }} />

      {/* Item rows */}
      <View className="gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <View
            key={i}
            className="flex-row justify-between items-center py-2 border-b border-dashed border-gray-200"
          >
            <View className="flex-row items-center gap-4">
              {/* delete icon placeholder */}
              <SkeletonPulse style={{ width: 18, height: 18, borderRadius: 9 }} />
              <SkeletonPulse style={{ width: 120 + (i % 3) * 30, height: 24, borderRadius: 6 }} />
            </View>
            <SkeletonPulse style={{ width: 55, height: 24, borderRadius: 6 }} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default ReceiptViewSkeleton;