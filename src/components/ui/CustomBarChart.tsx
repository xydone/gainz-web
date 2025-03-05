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
}: {
  className?: string;
  chartData: MacronutrientDataPoint[];
  date: IDate | undefined;
}) {
  if (date == undefined || date.from == undefined || date.to == undefined)
    return;
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>Nutrient Intake Chart</CardTitle>
        <CardDescription>{`${format(date.from, "dd MMMM yyyy")} - ${format(
          date.to,
          "dd MMMM yyyy"
        )}`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 8,
              right: 8,
            }}
          >
            <CartesianGrid vertical={false} strokeWidth={0.2} />
            <XAxis
              dataKey="macronutrient"
              tickLine={true}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
            <Bar dataKey="value" fill="var(--chart-1)" radius={4}>
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
