import * as Google from "expo-auth-session/providers/google";
import {
  AuthCredential,
  GoogleAuthProvider,
  signInWithCredential,
  User,
} from "firebase/auth";

import { auth } from "@/config/firebase";
import { useAuth, usePreferences } from "@/store/zustand";
import { maybeCompleteAuthSession } from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";

maybeCompleteAuthSession();
export function useGoogleAuth() {
  const { setToken } = useAuth();
  const { syncUser } = usePreferences();
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      "504897902930-77ghcsrjc59tnchacl22k21r1k8vg9ib.apps.googleusercontent.com",

    iosClientId:
      "504897902930-skljhr6p5b1kcm998lf5erfcc77emnjp.apps.googleusercontent.com",
    redirectUri:
      "com.googleusercontent.apps.504897902930-skljhr6p5b1kcm998lf5erfcc77emnjp:/oauthredirect",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      const signIn = async (cred: AuthCredential) => {
        try {
          const { user } = await signInWithCredential(auth, cred);
          setToken(await user.getIdToken());
          await syncUser({
            email: user.email || "",
            displayName: user.displayName || "",
          });

          return user;
        } catch (error) {
          console.error(error);
          return null;
        }
      };
      signIn(credential);
    }
  }, [response]);

  return { request, response, promptAsync };
}
