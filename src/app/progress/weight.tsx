"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/api";
import { useUserContext } from "@/app/context";
import { AxiosResponse } from "axios";
import { GoalsResponse } from "../signed-in";

interface Response {
  created_at: number;
  value: number;
}
const chartConfig = {
  value: {
    label: "Weight",
    color: "var(--protein)",
  },
  goal: {
    label: "Goal",
    color: "var(--goal)",
  },
} satisfies ChartConfig;

function processData(data: Response[], goalValue: number | null) {
  if (!data || data.length === 0) {
    return [];
  }

  const processedData = [];
  const currentDate = new Date(data[0].created_at / 1000);
  const endDate = new Date(data[data.length - 1].created_at / 1000);

  let dataIndex = 0;

  while (currentDate <= endDate) {
    const currentDateString = format(currentDate, "yyyy-MM-dd"); // Format to 'YYYY-MM-DD'
    const dataDate = format(
      new Date(data[dataIndex].created_at / 1000),
      "yyyy-MM-dd"
    );
    if (dataIndex < data.length && dataDate === currentDateString) {
      processedData.push({
        created_at: currentDateString,
        value: Math.round(data[dataIndex].value * 10) / 10,
        goal: goalValue,
      });
      dataIndex++;
    } else {
      processedData.push({
        created_at: currentDateString,
        value: null,
        goal: goalValue,
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return processedData;
}

export default function Weight({
  className,
  startDate,
  endDate,
}: {
  className?: string;
  startDate: string;
  endDate: string;
}) {
  const user = useUserContext();
  const [data, setData] = useState<Response[] | null>(null);
  const [goal, setGoal] = useState<number | null>(null);
  useEffect(() => {
    axiosInstance
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/measurement?type=weight&start=${startDate}&end=${endDate}`,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      )
      .then((response: AxiosResponse) => {
        setData(response.data);
      });
    axiosInstance
      .get(`${process.env.NEXT_PUBLIC_API_URL}/user/goals`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then((response: AxiosResponse) => {
        const data = response.data as GoalsResponse[];
        const weight = data.find((entry) => entry.target === "weight");
        if (!weight) return;
        setGoal(weight.value);
      });
  }, [endDate, startDate, user.accessToken]);
  if (!data) return;
  const processedData = processData(data, goal);
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>Weight</CardTitle>
        <CardDescription>{`${format(startDate, "dd MMMM yyyy")} - ${format(
          endDate,
          "dd MMMM yyyy"
        )}`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={processedData}
            margin={{
              left: 18,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              domain={["dataMin - 5", "dataMax + 5"]}
              width={12}
              tickFormatter={(value) => Math.round(value).toString()}
            />
            <XAxis
              dataKey="created_at"
              tickLine={false}
              axisLine={false}
              ticks={[data[0].created_at, data[data.length - 1].created_at]}
              tickFormatter={(value) => {
                return format(new Date(value / 1000), "dd-MM");
              }}
            />
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />

            <Line
              dataKey="value"
              type="monotone"
              stroke="var(--color-value)"
              strokeWidth={2}
              dot={false}
              connectNulls={true}
              isAnimationActive={false}
            />
            <Line
              dataKey="goal"
              type="monotone"
              stroke="var(--color-goal)"
              strokeWidth={2}
              dot={false}
              connectNulls={true}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
