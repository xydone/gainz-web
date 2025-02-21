"use client";
import { useUserContext } from "./context";
import NotSignedIn from "@/app/not-signed-in";
import SignedIn from "@/app/signed-in";
export default function Root() {
  const user = useUserContext();

  return user.isSignedIn ? <SignedIn /> : <NotSignedIn />;
}
