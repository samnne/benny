import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const springConfig = {
  damping: 12,
  stiffness: 300,
  mass: 0.6,
};

export const useButtonAnimation = () => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.94, springConfig);
  };

  const onPressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  return { animatedStyle, onPressIn, onPressOut };
};
