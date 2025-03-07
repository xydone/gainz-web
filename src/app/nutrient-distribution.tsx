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
import { Label, Legend, Pie, PieChart } from "recharts";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

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
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  sugar: number;
}

interface NutrientDistributionProps {
  className?: string;
  todayData: DayData;
  yesterdayData: DayData;
  size: number;
}

export interface DayData {
  nutrients: Nutrient[] | null;
  calories: number | null;
  summary: Summary | null;
}

export default function NutrientDistribution({
  className,
  todayData,
  size,
  yesterdayData,
}: NutrientDistributionProps) {
  const config = {
    dataKey: "intake",
    nameKey: "nutrient",
    innerRadius: size - 30,
    outerRadius: size,
    strokeWidth: 5,
    labelLine: false,
  };
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="pb-0">
        <CardTitle>Nutrients</CardTitle>
        <CardDescription>{"Today's nutrient distribution"}</CardDescription>
      </CardHeader>
      {todayData.nutrients || todayData.calories ? (
        <ValidResponse />
      ) : (
        <EmptyResponse />
      )}
    </Card>
  );

  function ValidResponse() {
    if (!todayData.nutrients || !todayData.calories) return;
    return (
      <div>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart margin={{}}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={todayData.nutrients}
                {...config}
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
              <Legend />
            </PieChart>
          </ChartContainer>
        </CardContent>
        {yesterdayData.calories &&
          yesterdayData.nutrients &&
          todayData.summary &&
          yesterdayData.summary && (
            <CardFooter className="flex-col gap-2 text-sm text-center">
              <div className="flex flex-col lg:flex-row items-center  font-medium leading-none">
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
              <div className="flex flex-col lg:flex-row items-center gap-2 font-medium leading-none text-muted-foreground">
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
      </div>
    );
  }
  function EmptyResponse() {
    return (
      <div>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart margin={{}}>
              <Pie
                data={[
                  { nutrient: "empty", intake: 1, fill: "var(--color-empty)" },
                ]}
                {...config}
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
      </div>
    );
  }
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
