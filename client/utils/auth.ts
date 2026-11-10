import { auth } from "@/config/firebase";

type ProviderLike = { providerId: string };
type UserLike = { providerData: ProviderLike[] } | null | undefined;

export const hasPasswordProvider = (user: UserLike = auth.currentUser) =>
  !!user?.providerData.some((provider) => provider.providerId === "password");

export const getAuthErrorCode = (error: unknown): string | undefined => {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return undefined;
  }

  const code = (error as { code?: unknown }).code;
  return typeof code === "string" ? code : undefined;
};

export const isRequiresRecentLogin = (error: unknown): boolean =>
  getAuthErrorCode(error) === "auth/requires-recent-login";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use":
    "That email is already linked to another account.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/invalid-credential": "That password doesn't look right.",
  "auth/wrong-password": "That password doesn't look right.",
  "auth/weak-password": "Use at least 6 characters for your new password.",
  "auth/requires-recent-login":
    "Please sign in again before making this change.",
  "auth/too-many-requests": "Too many attempts. Try again in a moment.",
  "auth/network-request-failed": "Check your connection and try again.",
  "auth/user-mismatch": "Those credentials belong to a different account.",
  "auth/no-current-user": "You need to be signed in to do that.",
  "auth/operation-not-allowed": "This change isn't allowed for your account.",
};

export const getAuthErrorMessage = (error: unknown): string => {
  const code = getAuthErrorCode(error);
  return (
    (code ? AUTH_ERROR_MESSAGES[code] : undefined) ??
    "Something went wrong. Please try again."
  );
};

export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
