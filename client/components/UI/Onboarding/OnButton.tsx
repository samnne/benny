import { View, Text } from "react-native";
import React from "react";

const OnButton = ({
  children,
  className,
  style
}: {
  className: string;
  children: React.ReactNode;
  style: object
}) => {
  return <View style={style} className={className}>{children}</View>;
};

export default OnButton;
