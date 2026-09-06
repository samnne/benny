import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

import { maybeCompleteAuthSession } from "expo-web-browser";
import { auth } from "@/config/firebase";
import { useEffect } from "react";

maybeCompleteAuthSession();
export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      "504897902930-77ghcsrjc59tnchacl22k21r1k8vg9ib.apps.googleusercontent.com",

    iosClientId:
      "504897902930-skljhr6p5b1kcm998lf5erfcc77emnjp.apps.googleusercontent.com",
    redirectUri: AuthSession.makeRedirectUri({ scheme: "benny" }),
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(({ user }) => console.log("Signed in:", user))
        .catch(console.error);
    }
  }, [response]);

  return { request, promptAsync };
}
