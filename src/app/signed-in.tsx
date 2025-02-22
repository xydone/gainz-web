import { useState } from "react";
import NutrientDistribution, { DayData } from "./nutrient-distribution";
import { CalorieGoal, ProteinGoal, SugarGoal } from "./goals";
import Weight from "./weight";
import QuickAdd from "./quick-add";
export default function SignedIn() {
  const [todayData, setTodayData] = useState<DayData>({
    nutrients: null,
    calories: null,
    summary: null,
  });
  return (
    <div className="mx-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CalorieGoal className="" todayData={todayData} />
        <ProteinGoal className="" todayData={todayData} />
        <SugarGoal className="" todayData={todayData} />
        <NutrientDistribution
          className=""
          todayData={todayData}
          setTodayData={setTodayData}
        />
        <QuickAdd />
        <Weight className="" />
      </div>
    </div>
  );
}
