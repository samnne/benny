import { auth } from "@/config/firebase";
import { getAuthErrorMessage } from "@/utils/auth";
import { updateProfile } from "firebase/auth";
import { Text } from "moti";
import { useState } from "react";
import { AccountField } from "./AccountField";
import { AccountModalShell, ModalActions } from "./AccountModalShell";

type EditNameModalProps = {
  visible: boolean;
  currentName: string;
  onClose: () => void;
  onSaved: () => void;
};

export const EditNameModal = ({
  visible,
  currentName,
  onClose,
  onSaved,
}: EditNameModalProps) => {
  const [name, setName] = useState(currentName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (saving) return;

    const user = auth.currentUser;
    if (!user) {
      setError("You need to be signed in to do that.");
      return;
    }

    const nextName = name.trim().replace(/\s+/g, " ");
    if (!nextName) {
      setError("Enter your name.");
      return;
    }

    if (nextName === (user.displayName ?? "")) {
      onClose();
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await updateProfile(user, { displayName: nextName });
      onSaved();
      onClose();
    } catch (e) {
      setError(getAuthErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AccountModalShell
      visible={visible}
      title="Your name"
      subtitle="This is what Benny calls you."
      onClose={onClose}
    >
      <AccountField
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="e.g. Sam"
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        returnKeyType="done"
        onSubmitEditing={handleSave}
      />
      {error ? (
        <Text className="font-nunito text-sm text-primary mb-3">{error}</Text>
      ) : null}
      <ModalActions
        onCancel={onClose}
        onConfirm={handleSave}
        confirmLabel="Save name"
        saving={saving}
      />
    </AccountModalShell>
  );
};
