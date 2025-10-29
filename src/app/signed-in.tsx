import NutrientDistribution from "./nutrient-distribution";
import { GoalsCard } from "./goals";
import QuickAdd from "./quick-add";
import { subMonths } from "date-fns";
import Weight from "./data/progress/weight";
import { useState } from "react";
import { Nutrients } from "./types";

import { DatePicker } from "@/components/ui/datepicker";

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
  const [date, setDate] = useState<Date>(new Date());
  const [goalCards] = useState<(keyof Nutrients)[]>([
    "calories",
    "protein",
    "sugar",
  ]);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center gap-4">
        <DatePicker date={date} setDate={setDate} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {goalCards.map((card, i) => {
          return <GoalsCard key={i} goalName={card} date={date} />;
        })}
        <NutrientDistribution className="" date={date} />
        <QuickAdd />
        <Weight className="" startDate={subMonths(date, 3)} endDate={date} />
      </div>
    </div>
  );
}
