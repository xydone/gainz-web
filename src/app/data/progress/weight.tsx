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
import { compareAsc, format, parse } from "date-fns";
import NoResponse from "../../../components/ui/NoResponseCard";
import { useGetWeight } from "./progress.service";
import { Skeleton } from "@/components/ui/skeleton";

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
  estimated: number | null;
  interpolated: number | null;
  goal?: number;
}

type ResponseWithDate = { date: Date } & Response;

function processData(data: ResponseWithDate[], endDate: Date) {
  const dateMap = new Map();
  if (!data || data.length === 0) {
    return [];
  }

  const processedData = [];
  const scale = [];
  const dateStrings = [];
  data.forEach((element, i) => {
    const indexDate = new Date(element.created_at / 1000);
    const shortDate = format(indexDate, "dd MMMM yyyy");
    if (dateMap.has(shortDate)) {
      const dateInsideMap = data[dateMap.get(shortDate)].created_at;
      const result = compareAsc(new Date(dateInsideMap / 1000), indexDate);
      // -1 - the data inside the map is before the one we are currently looking at
      // 0 - equal
      // 0 - the data we are currently looking at is before the one inside the map
      if (result == -1 || result == 0) {
        dateMap.set(shortDate, i);
      }
    } else {
      element.date = indexDate;
      dateMap.set(shortDate, i);
    }
  });
  const currentDate = new Date([...dateMap.keys()][0]);
  while (currentDate <= endDate) {
    const currentDateString = format(currentDate, "dd MMMM yyyy");
    dateStrings.push(currentDateString);

    if (dateMap.has(currentDateString)) {
      scale.push(
        Math.round(data[dateMap.get(currentDateString)].value * 10) / 10
      );
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
  startDate: Date;
  endDate: Date;
}) {
  const { data, isLoading, error } = useGetWeight({ startDate, endDate });

  // Processed data or empty array if loading/error
  const processedData = data ? processData(data, endDate) : [];

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>Weight</CardTitle>
        <CardDescription>{`${format(startDate, "dd MMMM yyyy")} - ${format(
          endDate,
          "dd MMMM yyyy"
        )}`}</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        {isLoading && <WeightCardSkeleton />}
        {error && !isLoading && (
          <NoResponse
            title="No weight measurements found"
            description="No weight measurements found in the given range"
          />
        )}

        <ChartContainer
          config={chartConfig}
          style={{ opacity: isLoading ? 0.5 : 1 }}
        >
          <LineChart
            accessibilityLayer
            data={processedData}
            margin={{ left: 18 }}
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

export function WeightCardSkeleton() {
  return (
    <div className="flex p-6 pt-0 absolute inset-0 z-10">
      <Skeleton className="w-full h-full" notRounded />
    </div>
  );
}
