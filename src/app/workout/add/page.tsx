"use client";

import { useUserContext } from "../../context";
import Loading from "../../loading";
import { redirect } from "next/navigation";
import Card from "./add-exercises";
import Workout from "./create-workout";

export default function AddWorkout() {
  const user = useUserContext();

  if (user.loading) return <Loading />;
  if (!user.isSignedIn) return redirect("/");

  return (
    <div className="flex flex-col w-full lg:w-1/2 items-center gap-5 mx-auto mb-5">
      <Workout />
      <Card />
    </div>
  );
}
