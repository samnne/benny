import { auth } from "@/config/firebase";
import { getAuthErrorMessage, hasPasswordProvider } from "@/utils/auth";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { Text } from "moti";
import { useState } from "react";
import { Alert } from "react-native";
import { AccountField } from "./AccountField";
import { AccountModalShell, ModalActions } from "./AccountModalShell";

type ChangePasswordModalProps = {
  visible: boolean;
  onClose: () => void;
};

export const ChangePasswordModal = ({
  visible,
  onClose,
}: ChangePasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canChangePassword, setCanChangePassword] = useState(() =>
    hasPasswordProvider(),
  );

  const handleSave = async () => {
    if (saving) return;

    const user = auth.currentUser;
    if (!user) {
      setError("You need to be signed in to do that.");
      return;
    }

    if (!hasPasswordProvider(user)) {
      setCanChangePassword(false);
      return;
    }

    if (!user.email) {
      setError("This account doesn't have an email address.");
      return;
    }

    if (!currentPassword) {
      setError("Enter your current password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Use at least 6 characters for your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Your new passwords don't match.");
      return;
    }

    if (newPassword === currentPassword) {
      setError("Choose a password different from your current one.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      onClose();
      Alert.alert("Password updated", "Your password has been changed.");
    } catch (e) {
      setError(getAuthErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AccountModalShell
      visible={visible}
      title="Change password"
      subtitle="Confirm your current password, then choose a new one."
      onClose={onClose}
    >
      {!canChangePassword ? (
        <>
          <Text className="font-nunito text-sm text-text/60 mb-4">
            You signed in with Google or Apple, so this account doesn&apos;t have
            a password to change.
          </Text>
          <ModalActions
            onCancel={onClose}
            onConfirm={onClose}
            confirmLabel="Got it"
          />
        </>
      ) : (
        <>
          <AccountField
            label="Current password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter your current password"
            secureTextEntry
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="next"
          />
          <AccountField
            label="New password"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="At least 6 characters"
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="next"
          />
          <AccountField
            label="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repeat your new password"
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
          {error ? (
            <Text className="font-nunito text-sm text-primary mb-3">{error}</Text>
          ) : null}
          <ModalActions
            onCancel={onClose}
            onConfirm={handleSave}
            confirmLabel="Update password"
            saving={saving}
          />
        </>
      )}
    </AccountModalShell>
  );
};
