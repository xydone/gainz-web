import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { MacronutrientMap, Nutrients } from "../../types";
import NoResponse from "../../../components/ui/NoResponseCard";
import LineFilter from "./LineFilter";
import { useGetDetailedStats, useGetGoals } from "./progress.service";

interface Response {
  created_at: number;
  nutrients: Nutrients;
}

export default function GoalsPercentage({
  className,
  startDate,
  endDate,
}: {
  className?: string;
  startDate: Date;
  endDate: Date;
}) {
  const [lines, setLines] = useState<string[]>([
    "calories",
    "protein",
    "sugar",
  ]);
  const chartConfig = {} satisfies ChartConfig;

  const { data: goals, error: goalsError } = useGetGoals();

  const { data, isLoading, error } = useGetDetailedStats({
    startDate,
    endDate,
  });

  if (isLoading) return;

  Object.keys(MacronutrientMap).forEach(
    (nutrient) =>
      //@ts-expect-error No index signature valid
      (chartConfig[nutrient] = {
        label: MacronutrientMap[nutrient],
        color: `var(--${nutrient})`,
      })
  );
  const allowedLines = Object.keys(MacronutrientMap);
  if (error) {
    return (
      <NoResponse
        title="No data"
        description="No intake data found in the given range"
      />
    );
  }
  if (goalsError) {
    return (
      <NoResponse
        title="No goals data"
        description="No goals data found for the given range"
      />
    );
  }
  const processedData = processData(data, goals);
  return (
    <Card className={cn("relative", className)}>
      <CardHeader>
        <CardTitle>Goals percentage</CardTitle>
        <CardDescription>{`${format(startDate, "dd MMMM yyyy")} - ${format(
          endDate,
          "dd MMMM yyyy"
        )}`}</CardDescription>
        <LineFilter
          maxLines={allowedLines}
          lines={lines}
          setLines={setLines}
          map={MacronutrientMap}
        />
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={processedData} margin={{ left: 24 }}>
            <CartesianGrid vertical={false} />
            <YAxis
              width={12}
              ticks={Array(5)
                .fill(0)
                .map((_, i) => i * 50)}
              tickFormatter={(value) => `${value}%`}
            />
            <XAxis
              dataKey={"created_at"}
              tickFormatter={(value) => {
                const parsed = parse(value, "dd MMMM yyyy", new Date());
                return format(parsed, "dd-MM");
              }}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent sort={true} />}
            />

            {lines &&
              lines.map((line, i) => (
                <Line
                  key={i}
                  dataKey={line}
                  stroke={`var(--color-${line})`}
                  type="monotone"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function processData(data: Response[] | undefined, goals: Nutrients) {
  if (!data) return [];
  const processedData: ({ created_at: string } & Partial<Nutrients>)[] = [];
  data.map((element) => {
    const nutrients = {};
    Object.keys(MacronutrientMap).forEach((key) => {
      //@ts-expect-error No index signature valid, would require rewriting a lot of code to fix
      if (goals[key]) {
        //@ts-expect-error No index signature valid, would require rewriting a lot of code to fix
        const value = (element.nutrients[key] / goals[key]) * 100;
        //@ts-expect-error No index signature valid, would require rewriting a lot of code to fix
        nutrients[key] = Math.round(value * 10) / 10;
      }
    });
    processedData.push({
      created_at: format(new Date(element.created_at / 1000), "dd MMMM yyyy"),
      ...nutrients,
    });
  });
  return processedData;
}
