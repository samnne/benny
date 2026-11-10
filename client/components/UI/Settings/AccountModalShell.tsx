import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "moti";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";

type AccountModalShellProps = {
  visible: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export const AccountModalShell = ({
  visible,
  title,
  subtitle,
  onClose,
  children,
}: AccountModalShellProps) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1 bg-text/20"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 16,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white rounded-3xl p-6">
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1 pr-3">
              <Text className="text-3xl font-fredoka-semibold text-text">
                {title}
              </Text>
              {subtitle ? (
                <Text className="font-nunito text-sm text-text/50 mt-1">
                  {subtitle}
                </Text>
              ) : null}
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Close"
              className="w-9 h-9 rounded-full bg-primary/10 items-center justify-center"
            >
              <Ionicons name="close" size={18} color="#e61e3f" />
            </Pressable>
          </View>
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </Modal>
);

export const ModalActions = ({
  onCancel,
  onConfirm,
  confirmLabel = "Save",
  saving = false,
  disabled = false,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  saving?: boolean;
  disabled?: boolean;
}) => (
  <View className="flex-row gap-3 mt-2">
    <Pressable
      onPress={onCancel}
      disabled={saving}
      className="flex-1 py-4 rounded-full border-2 border-primary/20 items-center"
    >
      <Text className="font-nunito-bold text-text/50">Cancel</Text>
    </Pressable>
    <Pressable
      onPress={onConfirm}
      disabled={saving || disabled}
      className={`flex-1 py-4 rounded-full bg-primary items-center ${
        saving || disabled ? "opacity-60" : ""
      }`}
    >
      <Text className="font-nunito-bold text-white text-lg">
        {saving ? "Saving…" : confirmLabel}
      </Text>
    </Pressable>
  </View>
);
