"use client";
import { useUserContext } from "./context";
import NotSignedIn from "@/app/not-signed-in";
import SignedIn from "@/app/signed-in";
import Loading from "./loading";
export default function Root() {
  const user = useUserContext();
  if (user.isSignedIn == null) return <Loading />;
  return user.isSignedIn ? <SignedIn /> : <NotSignedIn />;
}
