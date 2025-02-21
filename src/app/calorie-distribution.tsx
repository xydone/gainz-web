import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label, Pie, PieChart } from "recharts";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useUserContext } from "./context";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { axiosInstance } from "@/lib/api";
import { format, subDays } from "date-fns";
import { AxiosError } from "axios";

export const chartConfig = {
  intake: {
    label: "Intake",
  },
  protein: {
    label: "Protein",
    color: "var(--protein)",
  },
  carbs: {
    label: "Carbs",
    color: "var(--carbs)",
  },
  fat: {
    label: "Fat",
    color: "var(--fat)",
  },
  empty: {
    label: "Empty",
    color: "var(--chart-empty)",
  },
} satisfies ChartConfig;

interface Nutrient {
  nutrient: string;
  intake: number;
  fill: string;
}

interface Summary {
  protein: number;
  fat: number;
  carbs: number;
  sugar: number;
}

interface CalorieDistributionProps {
  className?: string;
}

interface DayData {
  nutrients: Nutrient[] | null;
  calories: number | null;
  summary: Summary | null;
}

export default function CalorieDistribution({
  className,
}: CalorieDistributionProps) {
  const user = useUserContext();
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

  useEffect(() => {
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
    const date = new Date(2024, 11, 20);
    const today = format(date, "yyyy-MM-dd");
    const yesterday = format(subDays(date, 1), "yyyy-MM-dd");
    fetchNutrients({
      day: today,
      setter: setTodayData,
    });
    fetchNutrients({
      day: yesterday,
      setter: setYesterdayData,
    });
  }, [user.accessToken]);

  if (!todayData.nutrients || !todayData.calories)
    return <EmptyResponse className={cn("mx-5", className)} />;
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Calories</CardTitle>
        <CardDescription className="text-center">
          {"Today's calorie intake distribution"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={todayData.nutrients}
              dataKey="intake"
              nameKey="nutrient"
              innerRadius={60}
              strokeWidth={5}
              labelLine={false}
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="var(--foreground)"
                  >
                    {payload.intake}
                  </text>
                );
              }}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {todayData.calories}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Calories
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      {yesterdayData.calories &&
        yesterdayData.nutrients &&
        todayData.summary &&
        yesterdayData.summary && (
          <CardFooter className="flex-col gap-2 text-sm text-center">
            <div className="flex items-center gap-2 font-medium leading-none">
              That is {Math.abs(todayData.calories - yesterdayData.calories)}{" "}
              {todayData.calories - yesterdayData.calories > 0
                ? "more"
                : "less"}{" "}
              calories than yesterday!{" "}
              {todayData.calories - yesterdayData.calories > 0 ? (
                <TrendingUp />
              ) : (
                <TrendingDown />
              )}
            </div>
            <div className="flex items-center gap-5 font-medium leading-none text-muted-foreground">
              <CalorieDistributionDescription
                today={todayData.summary}
                yesterday={yesterdayData.summary}
                nutrient="protein"
              />
              <CalorieDistributionDescription
                today={todayData.summary}
                yesterday={yesterdayData.summary}
                nutrient="carbs"
              />
              <CalorieDistributionDescription
                today={todayData.summary}
                yesterday={yesterdayData.summary}
                nutrient="fat"
              />
              <CalorieDistributionDescription
                today={todayData.summary}
                yesterday={yesterdayData.summary}
                nutrient="sugar"
              />
            </div>
          </CardFooter>
        )}
    </Card>
  );
}

function CalorieDistributionDescription({
  today,
  yesterday,
  nutrient,
}: {
  today: Summary;
  yesterday: Summary;
  nutrient: keyof Summary;
}) {
  const nutrientName = nutrient.charAt(0).toUpperCase() + nutrient.slice(1);
  const difference = today[nutrient] - yesterday[nutrient];
  return (
    <div className="flex flex-row items-center">
      {nutrientName}: {Math.abs(difference)}
      {difference > 0 ? <TrendingUp /> : <TrendingDown />}
    </div>
  );
}

function EmptyResponse({ className }: { className?: string }) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Calories</CardTitle>
        <CardDescription className="text-center">
          {"Today's calorie intake distribution"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <Pie
              data={[
                { nutrient: "empty", intake: 1, fill: "var(--color-empty)" },
              ]}
              dataKey="intake"
              nameKey="nutrient"
              innerRadius={60}
              strokeWidth={5}
              labelLine={false}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          0
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Calories
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none text-center">
          You have not entered any food yet.
        </div>
        <div className="leading-none text-muted-foreground text-center">
          To get a breakdown on your caloric intake for the day, log food and
          check again!
        </div>
      </CardFooter>
    </Card>
  );
}
