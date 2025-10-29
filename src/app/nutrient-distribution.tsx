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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

import { MacronutrientMap, nutrientChart, Nutrients } from "./types";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useGetEntryStats } from "./data/progress/progress.service";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const chartConfig = nutrientChart satisfies ChartConfig;

type ChartItem = {
  nutrient: string;
  intake: number;
  fill: string;
};

export default function NutrientDistribution({
  className,
  date,
}: {
  className: string;
  date: Date;
}) {
  const { data, isLoading, error } = useGetEntryStats({
    startDate: date,
    endDate: date,
  });

  const [nutrients, setNutrients] = useState<(keyof Nutrients)[]>([
    "carbs",
    "fat",
    "protein",
  ]);
  if (error) {
    return <ErrorResponse className={className} />;
  }
  if (isLoading || data == undefined) {
    return <NutrientGoalsCardSkeleton />;
  }

  const chartData: ChartItem[] = nutrients.map((nutrient) => ({
    nutrient,
    intake: Math.round(data[nutrient]),
    fill: `var(--color-${nutrient})`,
  }));
  return (
    <Card className={cn("relative", className)}>
      <CardHeader>
        <CardTitle>Nutrient Distribution</CardTitle>
        <CardDescription>Nutrient Distribution for today</CardDescription>
        <Filter lines={nutrients} setLines={setNutrients} />
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
        <CustomLegend data={chartData} />
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

function CustomLegend({ data }: { data: ChartItem[] }) {
  const dataKeys = new Set(data.map((item) => item.nutrient));

  return (
    <ScrollArea className="rounded-md border whitespace-nowrap">
      <div className="flex flex-row gap-4 justify-center space-x-4 p-4">
        {Object.keys(chartConfig)
          .filter((key) => dataKeys.has(key))
          .map((key, i) => {
            //@ts-expect-error indexing chartConfig
            const cfg = chartConfig[key];
            if (cfg.label === "empty") return null;

            return (
              <div key={i} className="flex flex-row gap-2 place-items-center">
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: cfg.color }}
                />
                <span className="text-xs">{cfg.label}</span>
              </div>
            );
          })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

function Filter({
  lines: filters,
  setLines: setFilters,
}: {
  lines: (keyof Nutrients)[];
  setLines: Dispatch<SetStateAction<(keyof Nutrients)[]>>;
}) {
  const allowed = (Object.keys(MacronutrientMap) as (keyof Nutrients)[]).filter(
    (key) => key !== "calories"
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="absolute top-5 right-5 text-muted">
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Display lines</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 ">
          {allowed.map((el, i) => {
            return (
              <div key={i} className="flex gap-3 items-center">
                <Checkbox
                  value={el}
                  checked={(() => {
                    if (filters && filters.some((element) => element === el)) {
                      return true;
                    }
                    return false;
                  })()}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilters((prevLines) =>
                        prevLines ? [...prevLines, el] : [el]
                      );
                    } else {
                      setFilters(
                        (prevLines) =>
                          prevLines?.filter((element) => element !== el) || null
                      );
                    }
                  }}
                />
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: `var(--${el})`,
                  }}
                />
                <label>{MacronutrientMap[el]}</label>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function NutrientGoalsCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5 w-40" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-60 mt-1" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mx-auto aspect-square max-h-[250px] relative">
          <Skeleton className="h-full w-full rounded-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <Skeleton className="h-4 w-12 rounded" />
          <Skeleton className="h-4 w-12 rounded" />
          <Skeleton className="h-4 w-12 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}
