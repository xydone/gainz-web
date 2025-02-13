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

type MacronutrientDataPoint = {
  macronutrient: string;
  value: number;
};
const chartConfig = {
  value: {
    label: "value",
  },
} satisfies ChartConfig;
export default function CustomBarChart({
  chartData,
}: {
  chartData: MacronutrientDataPoint[];
}) {
  return (
    <Card className="w-[40%]">
      <CardHeader>
        <CardTitle>Bar Chart - Horizontal</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
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
