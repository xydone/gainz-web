"use client";

import Exercise from "./exercise";
import Unit from "./unit";
import Category from "./category";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";
import { useUserContext } from "@/app/context";
import Loading from "@/app/loading";

export default function AddExercise({
  innerDivClassName,
}: {
  innerDivClassName?: string;
}) {
  const user = useUserContext();
  if (user.loading) return <Loading />;
  if (!user.isSignedIn) return redirect("/");
  return (
    <div>
      <h1 className="text-xl text-center">Create new exercise</h1>
      <div
        className={cn(
          "flex flex-col w-full lg:w-1/2 items-center gap-5 mx-auto mb-5",
          innerDivClassName
        )}
      >
        <div className="w-[90%] lg:w-2/3">
          <Exercise />
        </div>
        <div className="flex flex-col w-[90%] lg:w-2/3 justify-center gap-5 lg:flex-row">
          <Unit className="w-full" />
          <Category className="w-full" />
        </div>
      </div>
    </div>
  );
}
