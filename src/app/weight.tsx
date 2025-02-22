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
import { format, subMonths } from "date-fns";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/api";
import { useUserContext } from "./context";
import { AxiosResponse } from "axios";

interface Response {
  created_at: number;
  value: number;
}
const chartConfig = {
  value: {
    label: "Weight",
    color: "var(--protein)",
  },
} satisfies ChartConfig;

function processData(data: Response[]) {
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
      });
      dataIndex++;
    } else {
      processedData.push({
        created_at: currentDateString,
        value: null,
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return processedData;
}

export default function Weight({ className }: { className?: string }) {
  const user = useUserContext();
  const [data, setData] = useState<Response[] | null>(null);
  useEffect(() => {
    const today = new Date();
    const start = format(subMonths(today, 3), "yyyy-MM-dd");
    const end = format(today, "yyyy-MM-dd");
    axiosInstance
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/measurement?type=weight&start=${start}&end=${end}`,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      )
      .then((response: AxiosResponse) => {
        setData(response.data);
      });
  }, [user.accessToken]);
  if (!data) return;

  const processedData = processData(data);
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>Weight</CardTitle>
        <CardDescription>Weight in the past 3 months</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <ChartContainer config={chartConfig} className="max-h-64 w-full">
          <LineChart
            accessibilityLayer
            data={processedData}
            margin={{
              left: 12,
              right: 12,
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
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
