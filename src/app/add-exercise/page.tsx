"use client";

import Exercise from "./exercise";
import Unit from "./unit";
import Category from "./category";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function AddExercise({
  innerDivClassName,
}: {
  innerDivClassName?: string;
}) {
  //exists in order so we can refresh the api call in the exercise card whenever a new category is added individually
  const [categoryUpdate, setCategoryUpdate] = useState(0);
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
          <Exercise categoryUpdate={categoryUpdate} />
        </div>
        <div className="flex flex-col w-[90%] lg:w-2/3 justify-center gap-5 lg:flex-row">
          <Unit className="w-full" />
          <Category
            className="w-full"
            categoryUpdate={categoryUpdate}
            setCategoryUpdate={setCategoryUpdate}
          />
        </div>
      </div>
    </div>
  );
}
