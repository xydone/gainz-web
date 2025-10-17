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
import { Label, Pie, PieChart } from "recharts";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { axiosInstance } from "@/lib/api";
import { useUserContext } from "./context";
import { nutrientChart } from "./types";

const chartConfig = nutrientChart satisfies ChartConfig;

export default function NutrientDistribution({
  className,
  date,
}: {
  className: string;
  date: Date;
}) {
  const user = useUserContext();
  const today = format(date, "yyyy-MM-dd");
  const fetchEntry = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/entry/stats?start=${today}&end=${today}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["stats", user.accessToken, date],
    queryFn: fetchEntry,
  });

  if (isLoading) return;
  if (error) {
    return <ErrorResponse className={className} />;
  }
  const chartData = [
    {
      nutrient: "Protein",
      intake: Math.round(data.protein),
      fill: "var(--color-protein)",
    },
    {
      nutrient: "Carbs",
      intake: Math.round(data.carbs),
      fill: "var(--color-carbs)",
    },
    {
      nutrient: "Fat",
      intake: Math.round(data.fat),
      fill: "var(--color-fat)",
    },
    {
      nutrient: "Sugar",
      intake: Math.round(data.sugar),
      fill: "var(--color-sugar)",
    },
  ];
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>Nutrient Distribution</CardTitle>
        <CardDescription>Nutrient Distribution for today</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="intake"
              nameKey="nutrient"
              innerRadius={80}
              outerRadius={100}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {Math.round(data.calories).toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          calories
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <CustomLegend />
      </CardContent>
    </Card>
  );
}

function ErrorResponse({ className }: { className: string }) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>Nutrient Distribution</CardTitle>
        <CardDescription>Nutrient Distribution for today</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <Pie
              data={[
                {
                  nutrient: "empty",
                  intake: 100,
                  fill: "var(--color-empty)",
                },
              ]}
              dataKey="intake"
              nameKey="nutrient"
              innerRadius={80}
              outerRadius={100}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          0
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          calories
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function CustomLegend() {
  return (
    <div className="flex flex-row gap-4 justify-center">
      {Object.keys(chartConfig).map((item, i) => {
        //@ts-expect-error indexing
        if (chartConfig[item].label === "empty") {
          return;
        }
        return (
          <div key={i} className="flex flex-row gap-2 place-items-center">
            <div
              className="h-2 w-2 shrink-0 rounded-[2px]"
              style={{
                //@ts-expect-error indexing
                backgroundColor: chartConfig[item].color,
              }}
            />
            {/* @ts-expect-error indexing */}
            <span className="text-xs">{chartConfig[item].label}</span>
          </div>
        );
      })}
    </div>
  );
}
