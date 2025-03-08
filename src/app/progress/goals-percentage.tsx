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
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { useUserContext } from "../context";
import { MacronutrientMap, Nutrients } from "../types";
import { AxiosResponse } from "axios";

interface Response {
  entry_date: number;
  nutrients: Nutrients;
}

export default function GoalsPercentage({
  className,
  startDate,
  endDate,
  goals,
}: {
  className?: string;
  startDate: string;
  endDate: string;
  goals: Nutrients | null;
}) {
  const [data, setData] = useState<Response[] | null>(null);
  const user = useUserContext();
  const chartConfig = {} satisfies ChartConfig;
  useEffect(() => {
    axiosInstance
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/entry/stats/detailed?&start=${startDate}&end=${endDate}`,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      )
      .then((response: AxiosResponse) => setData(response.data));
  }, [startDate, endDate, user.accessToken]);

  Object.keys(MacronutrientMap).forEach(
    (nutrient) =>
      //@ts-expect-error No index signature valid
      (chartConfig[nutrient] = {
        label: MacronutrientMap[nutrient],
        color: `var(--${nutrient})`,
      })
  );
  const allowedLines = Object.keys(MacronutrientMap);
  if (!data || !goals) {
    return <h1>No data!</h1>;
  }
  const processedData = processData(data, goals);
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>Goals percentage</CardTitle>
        <CardDescription>{`${format(startDate, "dd MMMM yyyy")} - ${format(
          endDate,
          "dd MMMM yyyy"
        )}`}</CardDescription>
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
              tickFormatter={(value) => Math.round(value).toString()}
            />
            <XAxis
              dataKey="entry_date"
              tickLine={false}
              axisLine={false}
              ticks={[data[0].entry_date, data[data.length - 1].entry_date]}
              tickFormatter={(value) => {
                return format(new Date(value / 1000), "dd-MM");
              }}
            />
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />

            {allowedLines.map((line, i) => (
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

function processData(data: Response[], goals: Nutrients) {
  const processedData: ({ entry_date: string } & Partial<Nutrients>)[] = [];
  data.map((element) => {
    const nutrients = {};
    Object.keys(element.nutrients).forEach((key) => {
      //@ts-expect-error No index signature valid, would require rewriting a lot of code to fix
      if (goals[key]) {
        //@ts-expect-error No index signature valid, would require rewriting a lot of code to fix
        nutrients[key] = (element.nutrients[key] / goals[key]) * 100;
      }
    });
    processedData.push({
      entry_date: format(new Date(element.entry_date / 1000), "dd MMMM yyyy"),
      ...nutrients,
    });
  });
  return processedData;
}
