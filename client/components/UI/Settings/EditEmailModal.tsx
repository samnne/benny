import { auth } from "@/config/firebase";
import {
  getAuthErrorMessage,
  hasPasswordProvider,
  isRequiresRecentLogin,
  isValidEmail,
} from "@/utils/auth";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  updateEmail,
} from "firebase/auth";
import { Text } from "moti";
import { useState } from "react";
import { Alert } from "react-native";
import { AccountField } from "./AccountField";
import { AccountModalShell, ModalActions } from "./AccountModalShell";

type EditEmailModalProps = {
  visible: boolean;
  currentEmail: string;
  onClose: () => void;
  onSaved: () => void;
};

export const EditEmailModal = ({
  visible,
  currentEmail,
  onClose,
  onSaved,
}: EditEmailModalProps) => {
  const [email, setEmail] = useState(currentEmail);
  const [password, setPassword] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (saving) return;

    const user = auth.currentUser;
    if (!user) {
      setError("You need to be signed in to do that.");
      return;
    }

    if (!user.email) {
      setError("This account doesn't have an email address.");
      return;
    }

    const nextEmail = email.trim().toLowerCase();
    if (!isValidEmail(nextEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    if (nextEmail === user.email.toLowerCase()) {
      onClose();
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (needsPassword) {
        if (!password) {
          setError("Enter your current password.");
          return;
        }

        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
      }

      await updateEmail(user, nextEmail);

      // Best effort: ask Firebase to verify the new address.
      let verificationSent = false;
      try {
        await sendEmailVerification(user);
        verificationSent = true;
      } catch {
        // The email is already updated, so this isn't fatal.
      }

      onSaved();
      onClose();
      Alert.alert(
        "Email updated",
        verificationSent
          ? `We sent a verification link to ${nextEmail}.`
          : "Your email has been updated.",
      );
    } catch (e) {
      if (isRequiresRecentLogin(e)) {
        if (hasPasswordProvider(user)) {
          setNeedsPassword(true);
          setError("Enter your current password to confirm this change.");
        } else {
          setError("Please sign out and sign back in, then try again.");
        }
      } else {
        setError(getAuthErrorMessage(e));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <AccountModalShell
      visible={visible}
      title="Your email"
      subtitle="Used for signing in and account updates."
      onClose={onClose}
    >
      <AccountField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType={needsPassword ? "next" : "done"}
        onSubmitEditing={needsPassword ? undefined : handleSave}
      />
      {needsPassword ? (
        <AccountField
          label="Current password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your current password"
          secureTextEntry
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="done"
          onSubmitEditing={handleSave}
        />
      ) : null}
      {error ? (
        <Text className="font-nunito text-sm text-primary mb-3">{error}</Text>
      ) : null}
      <ModalActions
        onCancel={onClose}
        onConfirm={handleSave}
        confirmLabel="Save email"
        saving={saving}
      />
    </AccountModalShell>
  );
};
