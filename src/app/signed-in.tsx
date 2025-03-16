import NutrientDistribution from "./nutrient-distribution";
import { GoalsCard } from "./goals";
import QuickAdd from "./quick-add";
import { subMonths } from "date-fns";
import Weight from "./data/progress/weight";
import { useState } from "react";
import { Nutrients } from "./types";

interface Goal {
  value: number;
}
export interface Goals {
  protein: Goal | null;

  sugar: Goal | null;

  calories: Goal | null;
}

export interface GoalsResponse {
  id: number;
  target: string;
  value: number;
}
export default function SignedIn() {
  const date = new Date();
  const weightStartDate = subMonths(date, 3);
  const [goalCards, setGoalCards] = useState<(keyof Nutrients)[]>([
    "calories",
    "protein",
    "sugar",
  ]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {goalCards.map((card, i) => {
        return <GoalsCard key={i} goalName={card} />;
      })}
      <NutrientDistribution className="" />
      <QuickAdd />
      <Weight className="" startDate={weightStartDate} endDate={date} />
    </div>
  );
}
