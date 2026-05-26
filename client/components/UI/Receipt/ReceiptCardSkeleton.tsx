import React from "react";
import { View } from "react-native";
import SkeletonPulse from "../SkeletonPulse";

const ReceiptCardSkeleton = () => {
  return (
    <View className="w-full bg-white border-2 border-gray-100 rounded-t-2xl rounded-b-lg overflow-hidden h-80">
      {/* Header row */}
      <View className="flex-row justify-between p-4 items-center">
        <View className="flex-row gap-2 items-center">
          <SkeletonPulse style={{ width: 22, height: 22, borderRadius: 6 }} />
          <SkeletonPulse style={{ width: 140, height: 28, borderRadius: 8 }} />
        </View>
        <SkeletonPulse style={{ width: 70, height: 28, borderRadius: 8 }} />
      </View>

      <View className="h-px bg-gray-100" />

      {/* Item rows */}
      <View className="p-4 flex-1 gap-3">
        {[1, 2].map((i) => (
          <View key={i} className="flex-row justify-between items-center flex-1">
            <SkeletonPulse style={{ width: `${i === 1 ? 55 : 40}%`, height: 24, borderRadius: 6 }} />
            <SkeletonPulse style={{ width: 50, height: 24, borderRadius: 6 }} />
          </View>
        ))}
        <SkeletonPulse style={{ width: 90, height: 18, borderRadius: 6, marginTop: 4 }} />
      </View>

      {/* Benny footer */}
      <View className="bg-gray-50 flex-row items-center gap-2 p-3">
        <SkeletonPulse style={{ width: 20, height: 20, borderRadius: 10 }} />
        <SkeletonPulse style={{ width: "70%", height: 16, borderRadius: 6 }} />
      </View>
    </View>
  );
};

export default ReceiptCardSkeleton;