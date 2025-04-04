"use client";

import { useUserContext } from "../context";
import Height from "./height";
import Loading from "../loading";
import { redirect } from "next/navigation";

export default function Settings() {
  const user = useUserContext();

  if (user.loading) return <Loading />;
  if (!user.isSignedIn) return redirect("/");
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Height />
    </div>
  );
}
