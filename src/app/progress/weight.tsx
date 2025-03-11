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
import { format, parse } from "date-fns";
import { axiosInstance } from "@/lib/api";
import { useUserContext } from "@/app/context";
import NoResponse from "./NoResponse";
import { useQuery } from "@tanstack/react-query";

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
    label: "Scale Weight (Interpolated)",
    color: "var(--weight-scale)",
  },
  goal: {
    label: "Goal",
    color: "var(--goal)",
  },
} satisfies ChartConfig;

interface Chart {
  created_at: string;
  scale: number | null;
  estimated: number;
  interpolated: number | null;
  goal?: number;
}
function processData(data: Response[]) {
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
    const currentDateString = format(currentDate, "dd MMMM yyyy");
    dateStrings.push(currentDateString);
    const dataDate = format(
      new Date(data[i].created_at / 1000),
      "dd MMMM yyyy"
    );
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
    const obj: Chart = {
      created_at: dateStrings[idx],
      scale: scale[idx],
      interpolated: cleanInterpolatedData[idx],
      estimated: emwaData[idx],
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

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/measurement?type=weight&start=${startDate}&end=${endDate}`,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const { data, error } = useQuery({
    queryKey: ["weight", startDate, endDate, user.accessToken],
    queryFn: fetchData,
  });

  if (error) {
    return (
      <NoResponse
        title="No weight measurements found"
        description="No weight measurements found in the given range"
      />
    );
  }
  const processedData = processData(data);
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
              tickFormatter={(value) => {
                return Math.round(value).toString();
              }}
            />
            <XAxis
              dataKey={"created_at"}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                const parsed = parse(value, "dd MMMM yyyy", new Date());
                return format(parsed, "dd-MM");
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
