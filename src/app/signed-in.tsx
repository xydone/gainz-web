import { useEffect, useState } from "react";
import NutrientDistribution, { DayData } from "./nutrient-distribution";
import { CalorieGoal, ProteinGoal, SugarGoal } from "./goals";
import Weight from "./weight";
import QuickAdd from "./quick-add";
import { axiosInstance } from "@/lib/api";
import { useUserContext } from "./context";
interface Goal {
  id: number;
  value: number;
}
export interface Goals {
  protein: Goal | null;

  sugar: Goal | null;

  calorie: Goal | null;
}

interface Response {
  id: number;
  nutrient: string;
  value: number;
}
export default function SignedIn() {
  const [todayData, setTodayData] = useState<DayData>({
    nutrients: null,
    calories: null,
    summary: null,
  });
  const [goals, setGoals] = useState<Goals | null>(null);
  const user = useUserContext();
  useEffect(() => {
    axiosInstance
      .get(`${process.env.NEXT_PUBLIC_API_URL}/user/goals`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then((response) => {
        const data = response.data as Response[];
        const protein = data.find((entry) => entry.nutrient === "protein");
        const sugar = data.find((entry) => entry.nutrient === "sugar");
        const calorie = data.find((entry) => entry.nutrient === "calories");
        const createGoal = (entry: Response | undefined): Goal | null => {
          if (entry) {
            return {
              id: entry.id,
              value: entry.value,
            };
          }
          return null;
        };
        setGoals({
          protein: createGoal(protein),
          sugar: createGoal(sugar),
          calorie: createGoal(calorie),
        });
      });
  }, [user.accessToken]);
  return (
    //TODO: known issue in which setting the value in the goal element doesn't update the charts
    <div className="mx-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals && goals.calorie && (
          <CalorieGoal
            className=""
            todayData={todayData}
            goal={goals.calorie.value}
          />
        )}
        {goals && goals.protein && (
          <ProteinGoal
            className=""
            todayData={todayData}
            goal={goals.protein.value}
          />
        )}
        {goals && goals.sugar && (
          <SugarGoal
            className=""
            todayData={todayData}
            goal={goals.sugar.value}
          />
        )}
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
