import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { DayData } from "./nutrient-distribution";

interface Data {
  nutrient: string;
  value: number;
  fill: string;
}

const caloriesConfig = {
  value: {
    label: "Value",
  },
  calories: {
    label: "Calories",
    color: "var(--destructive)",
  },
} satisfies ChartConfig;
const proteinConfig = {
  value: {
    label: "Value",
  },
  calories: {
    label: "Protein",
    color: "var(--destructive)",
  },
} satisfies ChartConfig;
const sugarConfig = {
  value: {
    label: "Value",
  },
  calories: {
    label: "Sugar",
    color: "var(--destructive)",
  },
} satisfies ChartConfig;
export function CalorieGoal({
  className,
  todayData,
  goal,
}: {
  className?: string;
  todayData: DayData;
  goal: number;
}) {
  if (!todayData.calories) return;
  const caloriesData = [
    {
      nutrient: "calories",
      value: todayData.calories,
      fill: "var(--color-calories)",
    },
  ];
  return (
    <BasicCard
      data={caloriesData}
      config={caloriesConfig}
      goalValue={goal}
      className={cn("w-full", className)}
    />
  );
}
export function ProteinGoal({
  className,
  todayData,
  goal,
}: {
  className?: string;
  todayData: DayData;
  goal: number;
}) {
  if (!todayData.calories) return;
  const proteinData = [
    {
      nutrient: "protein",
      value: 40,
      fill: "var(--color-calories)",
    },
  ];
  return (
    <BasicCard
      data={proteinData}
      config={proteinConfig}
      goalValue={goal}
      className={cn("w-full", className)}
    />
  );
}
export function SugarGoal({
  className,
  todayData,
  goal,
}: {
  className?: string;
  todayData: DayData;
  goal: number;
}) {
  if (!todayData.calories) return;
  const sugarData = [
    {
      nutrient: "sugar",
      value: 100,
      fill: "var(--color-calories)",
    },
  ];
  return (
    <BasicCard
      data={sugarData}
      config={sugarConfig}
      goalValue={goal}
      className={cn("w-full", className)}
    />
  );
}

function BasicCard({
  className,
  data,
  config,
  goalValue,
}: {
  className?: string;
  data: Data[];
  config: ChartConfig;
  goalValue: number;
}) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>
          {`${
            data[0].nutrient[0].toUpperCase() + data[0].nutrient.slice(1)
          } goals`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BasicChart data={data} config={config} goalValue={goalValue} />
      </CardContent>
    </Card>
  );
}

function BasicChart({
  data,
  config,
  goalValue,
}: {
  data: Data[];
  config: ChartConfig;
  goalValue: number;
}) {
  return (
    <ChartContainer
      config={config}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <RadialBarChart
        data={data}
        startAngle={(data[0].value / goalValue) * 360}
        innerRadius={80}
        outerRadius={140}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[86, 74]}
        />
        <RadialBar dataKey="value" />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                      className="fill-foreground text-4xl font-bold"
                    >
                      {data[0].value - goalValue}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      {`${
                        data[0].nutrient[0].toUpperCase() +
                        data[0].nutrient.slice(1)
                      } ${data[0].value < goalValue ? "remain" : "over"}`}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}
