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
import { axiosInstance } from "@/lib/api";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { useUserContext } from "../context";
import { MacronutrientMap, Nutrients } from "../types";
import NoResponse from "./NoResponse";
import LineFilter from "./LineFilter";
import { useQuery } from "@tanstack/react-query";

interface Response {
  entry_date: number;
  nutrients: Nutrients;
}

export default function GoalsPercentage({
  className,
  startDate,
  endDate,
}: {
  className?: string;
  startDate: string;
  endDate: string;
}) {
  const [lines, setLines] = useState<string[]>([
    "calories",
    "protein",
    "sugar",
  ]);
  const user = useUserContext();
  const chartConfig = {} satisfies ChartConfig;
  const fetchGoals = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/goals`,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };
  const { data: goals, error: goalsError } = useQuery({
    queryKey: ["goals"],
    queryFn: fetchGoals,
  });
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/entry/stats/detailed?&start=${startDate}&end=${endDate}`,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const { data, error } = useQuery({
    queryKey: ["goalsPercentage", startDate, endDate],
    queryFn: fetchData,
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
              dataKey={"entry_date"}
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
  const processedData: ({ entry_date: string } & Partial<Nutrients>)[] = [];
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
      entry_date: format(new Date(element.entry_date / 1000), "dd MMMM yyyy"),
      ...nutrients,
    });
  });
  return processedData;
}
