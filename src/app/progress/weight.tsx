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
import { cn, ewma, lerp } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/api";
import { useUserContext } from "@/app/context";
import { AxiosResponse } from "axios";
import { GoalsResponse } from "../signed-in";
import NoResponse from "./NoResponse";

interface Response {
  created_at: number;
  value: number;
}
const chartConfig = {
  scale: {
    label: "Scale Weight",
    color: "var(--weight-scale)",
  },
  estimated: {
    label: "Estimated Weight",
    color: "var(--weight-estimated)",
  },
  interpolated: {
    label: "Interpolated Weight",
    color: "var(--weight-scale)",
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
  const scale = [];
  const dateStrings = [];
  const currentDate = new Date(data[0].created_at / 1000);
  const endDate = new Date(data[data.length - 1].created_at / 1000);
  let i = 0;
  while (currentDate <= endDate) {
    const currentDateString = format(currentDate, "yyyy-MM-dd");
    dateStrings.push(currentDateString);
    const dataDate = format(new Date(data[i].created_at / 1000), "yyyy-MM-dd");
    if (i < data.length && dataDate === currentDateString) {
      scale.push(Math.round(data[i].value * 10) / 10);
      i++;
    } else {
      scale.push(null);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  const interpolatedData = lerp(scale);
  const cleanInterpolatedData = scale.map((value, index) => {
    if (value == null) {
      return interpolatedData[index];
    }
    return null;
  });
  const emwaData = ewma(interpolatedData, 0.5);
  for (let idx = 0; idx < dateStrings.length; idx++) {
    const obj = {
      created_at: dateStrings[idx],
      scale: scale[idx],
      interpolated: cleanInterpolatedData[idx],
      estimated: emwaData[idx],
      goal: goalValue,
    };
    processedData.push(obj);
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
      })
      .catch(() => {});
    axiosInstance
      .get(`${process.env.NEXT_PUBLIC_API_URL}/user/goals`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then((response: AxiosResponse) => {
        const data = response.data as GoalsResponse[];
        const weight = data.find((entry) => entry.target === "weight");
        if (!weight) return;
        setGoal(weight.value);
      })
      .catch(() => {});
  }, [endDate, startDate, user.accessToken]);
  if (!data || !data.length) {
    return (
      <NoResponse
        title="No weight measurements found"
        description="No weight measurements found in the given range"
      />
    );
  }
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
              dataKey="scale"
              type="monotone"
              stroke="var(--color-scale)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              dataKey="interpolated"
              type="monotone"
              stroke="var(--color-interpolated)"
              strokeWidth={0}
              dot={{
                stroke: "var(--color-interpolated)",
                fill: "var(--color-interpolated)",
                strokeWidth: 2,
                r: 0.5,
              }}
              isAnimationActive={false}
            />

            <Line
              dataKey="estimated"
              type="monotone"
              stroke="var(--color-estimated)"
              strokeWidth={2}
              dot={false}
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
