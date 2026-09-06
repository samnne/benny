import { Switch } from "react-native";
import { Row } from "./Row";

export const ToggleRow = ({
  icon,
  label,
  sublabel,
  value,
  onChange,
}: {
  icon: string;
  label: string;
  sublabel?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) => (
  <Row
    icon={icon}
    label={label}
    sublabel={sublabel}
    right={
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#f0d5da", true: "#e61e3f" }}
        thumbColor="#ffffff"
      />
    }
  />
);
