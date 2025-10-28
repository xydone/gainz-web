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
import {
  eachDayOfInterval,
  format,
  fromUnixTime,
  isSameDay,
  parse,
} from "date-fns";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { MacronutrientMap, Nutrients } from "../../types";
import NoResponse from "../../../components/ui/NoResponseCard";
import LineFilter from "./LineFilter";
import { GetGoals, useGetDetailedStats, useGetGoals } from "./progress.service";
import { Skeleton } from "@/components/ui/skeleton";

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
  const processedData = processData(data, goals, startDate, endDate);
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
      <CardContent className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-10">
            <GoalsPercentageSkeleton />
          </div>
        )}
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

function processData(
  data: Response[] | undefined,
  goals: GetGoals[],
  startDate: Date,
  endDate: Date
) {
  const normalize = (t: number) => (t > 1e12 ? Math.floor(t / 1000) : t);
  if (!data) return [];

  const sortedGoals = [...goals].sort((a, b) => a.created_at - b.created_at);

  const processedData: ({ created_at: string } & Partial<Nutrients>)[] = [];

  const interval = eachDayOfInterval({ start: startDate, end: endDate });
  const datesMap = data.map((item) => ({
    date: fromUnixTime(item.created_at / 1_000_000),
    item,
  }));

  interval.forEach((date) => {
    const matched = datesMap.find(({ date: d }) => isSameDay(d, date));

    const nutrients: Partial<Nutrients> = {};

    if (matched) {
      const element = matched.item;

      Object.keys(MacronutrientMap).forEach((key) => {
        const goal = [...sortedGoals]
          .filter(
            (g) =>
              g.target === key && normalize(g.created_at) <= element.created_at
          )
          .sort((a, b) => normalize(b.created_at) - normalize(a.created_at))[0];

        const nutrientValue = element.nutrients?.[key as keyof Nutrients];

        if (goal) {
          const percentage = (nutrientValue / goal.value) * 100;
          nutrients[key as keyof Nutrients] = Math.round(percentage * 10) / 10;
        }
      });
    } else {
      // no data for given day, push nothing
      Object.keys(MacronutrientMap).forEach((key) => {
        nutrients[key as keyof Nutrients] = undefined;
      });
    }

    processedData.push({
      created_at: format(date, "dd MMMM yyyy"),
      ...nutrients,
    });
  });

  return processedData;
}

export function GoalsPercentageSkeleton() {
  return (
    <div className="flex p-6 pt-0 absolute inset-0 z-10">
      <Skeleton className="w-full h-full" notRounded />
    </div>
  );
}
