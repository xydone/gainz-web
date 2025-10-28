"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

type MacronutrientDataPoint = {
  macronutrient: string;
  value: number;
};
interface IDate {
  from: Date;
  to: Date;
}
const chartConfig = {
  value: {
    label: "value",
  },
} satisfies ChartConfig;
export default function CustomBarChart({
  className,
  chartData,
  date,
  skeleton,
}: {
  className?: string;
  chartData: MacronutrientDataPoint[];
  date: IDate | undefined;
  skeleton: boolean;
}) {
  if (!date?.from || !date?.to) return null;

  // Use empty array if chartData is not ready
  const data = chartData || [];

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>Nutrient Intake Chart</CardTitle>
        <CardDescription>{`${format(date.from, "dd MMMM yyyy")} - ${format(
          date.to,
          "dd MMMM yyyy"
        )}`}</CardDescription>
      </CardHeader>
      <CardContent style={{ position: "relative" }}>
        {skeleton && <CustomBarChartSkeleton />}

        <ChartContainer
          config={chartConfig}
          style={{ opacity: chartData.length === 0 ? 0.5 : 1 }}
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ top: 20, left: 8, right: 8 }}
          >
            <CartesianGrid vertical={false} strokeWidth={0.2} />
            <XAxis
              dataKey="macronutrient"
              tickLine={true}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
            <Bar dataKey="value" fill="var(--accent)" radius={4}>
              <LabelList
                dataKey="value"
                position="top"
                offset={5}
                className="fill-[--chart-1]"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function CustomBarChartSkeleton() {
  const length = 15;

  const barHeights = Array.from({ length }).map(() =>
    Math.floor(Math.random() * 200)
  );

  return (
    <div className="flex p-6 pt-0 absolute inset-0 z-10">
      <div className="w-full flex flex-col justify-end space-y-2">
        <div className="flex w-full justify-between px-4 pb-4 items-end">
          {barHeights.map((height, i) => (
            <Skeleton
              key={i}
              className="w-6 rounded-md"
              style={{ height: height }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
