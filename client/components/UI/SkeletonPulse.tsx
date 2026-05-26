import React, { useEffect, useRef } from "react";
import { Animated, View, ViewStyle } from "react-native";

interface SkeletonPulseProps {
  style?: ViewStyle;
  className?: string;
}

const SkeletonPulse = ({ style, className }: SkeletonPulseProps) => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[{ backgroundColor: "#e5e7eb", borderRadius: 8, opacity }, style]}
      className={className}
    />
  );
};

export default SkeletonPulse;