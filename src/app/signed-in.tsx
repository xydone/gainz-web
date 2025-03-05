import { useEffect, useState, Dispatch, SetStateAction } from "react";
import NutrientDistribution, { DayData } from "./nutrient-distribution";
import { ChartConfig } from "@/components/ui/chart";
import { GoalsCard } from "./goals";
import QuickAdd from "./quick-add";
import { axiosInstance } from "@/lib/api";
import { useUserContext } from "./context";
import { AxiosError } from "axios";
import { format, subDays, subMonths } from "date-fns";
import Weight from "./progress/weight";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
interface Goal {
  value: number;
}
export interface Goals {
  protein: Goal | null;

  sugar: Goal | null;

  calories: Goal | null;
}

const configs = {
  calories: {
    value: {
      label: "Value",
    },
    calories: {
      label: "Calories",
      color: "var(--destructive)",
    },
  } satisfies ChartConfig,
  protein: {
    value: {
      label: "Value",
    },
    calories: {
      label: "Protein",
      color: "var(--destructive)",
    },
  } satisfies ChartConfig,
  sugar: {
    value: {
      label: "Value",
    },
    calories: {
      label: "Sugar",
      color: "var(--destructive)",
    },
  } satisfies ChartConfig,
};

export interface GoalsResponse {
  id: number;
  target: string;
  value: number;
}
export default function SignedIn() {
  const [todayData, setTodayData] = useState<DayData>({
    nutrients: null,
    calories: null,
    summary: null,
  });

  const [yesterdayData, setYesterdayData] = useState<DayData>({
    nutrients: null,
    calories: null,
    summary: null,
  });
  const date = new Date();
  const today = format(date, "yyyy-MM-dd");
  const yesterday = format(subDays(date, 1), "yyyy-MM-dd");
  const weightStartDate = format(subMonths(date, 3), "yyyy-MM-dd");
  const [goals, setGoals] = useState<Goals | null>(null);
  const user = useUserContext();
  useEffect(() => {
    axiosInstance
      .get(`${process.env.NEXT_PUBLIC_API_URL}/user/goals`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then((response) => {
        const data = response.data as GoalsResponse[];
        const protein = data.find((entry) => entry.target === "protein");
        const sugar = data.find((entry) => entry.target === "sugar");
        const calorie = data.find((entry) => entry.target === "calories");
        const createGoal = (entry: GoalsResponse | undefined): Goal | null => {
          if (entry) {
            return {
              value: entry.value,
            };
          }
          return null;
        };
        setGoals({
          protein: createGoal(protein),
          sugar: createGoal(sugar),
          calories: createGoal(calorie),
        });
      });
    if (!user.accessToken) return;
    function fetchNutrients({
      day,
      setter,
    }: {
      day: string;
      setter: Dispatch<SetStateAction<DayData>>;
    }) {
      axiosInstance
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/user/entry/stats?start=${day}&end=${day}`,
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }
        )
        .then((response) => {
          setter({
            summary: {
              calories: Math.round(response.data.calories),
              protein: Math.round(response.data.protein),
              carbs: Math.round(response.data.carbs),
              fat: Math.round(response.data.fat),
              sugar: Math.round(response.data.sugar),
            },
            nutrients: [
              {
                nutrient: "Protein",
                intake: Math.round(response.data.protein),
                fill: "var(--color-protein)",
              },
              {
                nutrient: "Carbs",
                intake: Math.round(response.data.carbs),
                fill: "var(--color-carbs)",
              },
              {
                nutrient: "Fat",
                intake: Math.round(response.data.fat),
                fill: "var(--color-fat)",
              },
            ],

            calories: Math.round(response.data.calories),
          });
        })
        .catch((error: AxiosError) => {
          if (error.status !== 404) {
            console.log(error);
          }
        });
    }
    fetchNutrients({
      day: today,
      setter: setTodayData,
    });
    fetchNutrients({
      day: yesterday,
      setter: setYesterdayData,
    });
  }, [today, user.accessToken, yesterday]);
  // if (!todayData.nutrients) return;
  const nutrientCards = [
    {
      nutrient: "calories",
      fill: "var(--color-calories)",
    },
    {
      nutrient: "protein",
      fill: "var(--color-protein)",
    },
    {
      nutrient: "sugar",
      fill: "var(--color-sugar)",
    },
  ];
  return (
    <div className="mx-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <NutrientCards />
        <NutrientDistribution
          className=""
          todayData={todayData}
          yesterdayData={yesterdayData}
        />
        <QuickAdd />
        <Weight
          className=""
          startDate={weightStartDate}
          endDate={format(date, "yyyy-MM-dd")}
        />
      </div>
    </div>
  );

  function NutrientCards() {
    return nutrientCards.map((card, i) => {
      if (!todayData.summary) {
        return (
          <Card key={i}>
            <CardHeader>
              <CardTitle>No {card.nutrient}!</CardTitle>
              <CardDescription>
                {`You haven't entered any food yet. To get progress on your
                ${card.nutrient} goals for the day, log food and check again!`}
              </CardDescription>
            </CardHeader>
          </Card>
        );
      }
      return (
        goals &&
        todayData.summary &&
        //@ts-expect-error No index signature valid, would require rewriting a lot of code to fix
        todayData.summary[card.nutrient] && (
          <GoalsCard
            key={i}
            className=""
            data={[
              {
                nutrient: card.nutrient,
                //@ts-expect-error No index signature valid, would require rewriting a lot of code to fix
                value: todayData.summary[card.nutrient],
                fill: "var(--color-calories)",
              },
            ]}
            //@ts-expect-error No index signature valid, would require rewriting a lot of code to fix
            config={configs[card.nutrient]}
            //@ts-expect-error No index signature valid, would require rewriting a lot of code to fix
            goalValue={goals[card.nutrient].value}
            setGoals={setGoals}
            overflow={card.nutrient == "calories" ? false : true}
          />
        )
      );
    });
  }
}
