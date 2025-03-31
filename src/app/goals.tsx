import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Minus, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { axiosInstance } from "@/lib/api";
import { useUserContext } from "./context";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { MacronutrientMap, nutrientChart } from "./types";

interface Data {
  nutrient: string;
  value: number;
  fill: string;
}

const chartConfig = {
  intake: {
    label: "Intake",
  },
  ...nutrientChart,
} satisfies ChartConfig;

export function GoalsCard({
  className,
  goalName,
}: {
  className?: string;
  goalName: string;
}) {
  const user = useUserContext();
  const [goal, setGoal] = useState<number>(0);
  const nutrientCaps = goalName[0].toUpperCase() + goalName.slice(1);
  const overflow = false;
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/goals`,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      setGoal(response.data[goalName]);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const { data: goalsData } = useQuery({
    queryKey: ["goals", user.accessToken],
    queryFn: fetchData,
  });

  const day = format(new Date(), "yyyy-MM-dd");
  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/entry/stats?start=${day}&end=${day}`,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const { data: statsData } = useQuery({
    queryKey: ["stats", user.accessToken],
    queryFn: fetchStats,
  });
  if (goalsData == undefined || statsData == undefined)
    return <NoDataCard nutrient={goalName} goal={goal} setGoals={setGoal} />;
  if (!goalsData[goalName])
    return <NoGoalsCard nutrient={goalName} setGoals={setGoal} />;
  return (
    <Card className={cn("relative", className)}>
      <CardHeader>
        <CardTitle>
          {`${nutrientCaps} goals`}
          <CardDescription>Goal is {goalsData[goalName]}</CardDescription>
          <EditGoalsButton
            nutrient={goalName}
            goalValue={goal}
            setGoals={setGoal}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BasicChart
          data={statsData}
          goalName={goalName}
          goalValue={goalsData}
          overflow={overflow}
        />
      </CardContent>
    </Card>
  );
}

function EditGoalsButton({
  goalValue,
  setGoals,
  nutrient,
}: {
  goalValue: number;
  setGoals: Dispatch<SetStateAction<number>>;
  nutrient: string;
}) {
  const user = useUserContext();
  const [tempGoal, setTempGoal] = useState(goalValue);
  useEffect(() => {
    setTempGoal(goalValue);
  }, [goalValue]);
  function onClick(adjustment: number) {
    setGoals(goalValue + adjustment);
  }
  const submit = () => {
    axiosInstance
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/goals`,
        { target: nutrient, value: goalValue },
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      )
      .then(() => {
        setGoals(goalValue);
      });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="absolute top-5 right-5 text-muted">
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Edit {tempGoal} {MacronutrientMap[nutrient].toLowerCase()} goals
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-row items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 gap-0 shrink-0 rounded-full"
            onClick={() => onClick(-100)}
            disabled={goalValue <= 0}
          >
            <Minus /> <Minus />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 shrink-0 rounded-full"
            onClick={() => onClick(-10)}
            disabled={goalValue <= 0}
          >
            <Minus />
          </Button>

          <div className="flex-1 text-center">
            <div className="text-7xl font-bold tracking-tighter">
              {goalValue}
            </div>
            <div className="text-[0.70rem] uppercase text-muted-foreground">
              {MacronutrientMap[nutrient]}/day
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 gap-0 shrink-0 rounded-full"
            onClick={() => onClick(10)}
          >
            <Plus />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 gap-0 shrink-0 rounded-full"
            onClick={() => onClick(100)}
          >
            <Plus /> <Plus />
          </Button>
        </div>
        <Button variant="outline" onClick={submit}>
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function BasicChart({
  data,
  goalValue,
  goalName,
  overflow,
}: {
  data: Data[];
  goalValue: number;
  goalName: string;
  overflow?: boolean;
}) {
  //@ts-expect-error indexing
  const loggedForGoal = data[goalName];
  //@ts-expect-error indexing
  const goal = goalValue[goalName];
  const angle = (loggedForGoal / goal) * 360;
  const chartData = [
    {
      nutrient: goalName,
      intake: loggedForGoal,
      fill: `var(--color-${goalName})`,
    },
  ];
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <RadialBarChart
        data={chartData}
        startAngle={
          overflow ? (loggedForGoal / goalValue) * 360 : angle < 360 ? angle : 0
        }
        innerRadius={90}
        outerRadius={160}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-chart-empty last:fill-background"
          polarRadius={[100, 80]}
        />
        <RadialBar dataKey="intake" background />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                      className="fill-foreground text-4xl font-bold"
                    >
                      {Math.round(goal - loggedForGoal)}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      {`${goalName[0].toUpperCase() + goalName.slice(1)} ${
                        loggedForGoal < goal ? "remain" : "over"
                      }`}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}

export function NoGoalsCard({
  className,
  nutrient,
  setGoals,
}: {
  className?: string;
  nutrient: string;
  setGoals: Dispatch<SetStateAction<number>>;
}) {
  return (
    <Card className={cn("relative", className)}>
      <CardHeader>
        <CardTitle>
          No {MacronutrientMap[nutrient].toLowerCase()} goals!
          <EditGoalsButton
            goalValue={0}
            nutrient={nutrient}
            setGoals={setGoals}
          />
        </CardTitle>
        <CardDescription>
          {`You haven't entered any goals for ${MacronutrientMap[
            nutrient
          ].toLowerCase()} yet.`}
        </CardDescription>
        <CardDescription>
          {`To get progress on your
        ${MacronutrientMap[
          nutrient
        ].toLowerCase()} goals for the day, add a goal and check again!`}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export function NoDataCard({
  className,
  nutrient,
  goal,
  setGoals,
}: {
  className?: string;
  nutrient: string;
  goal: number;
  setGoals: Dispatch<SetStateAction<number>>;
}) {
  return (
    <Card className={cn("relative", className)}>
      <CardHeader>
        <CardTitle>
          No {MacronutrientMap[nutrient].toLowerCase()} data!
          <EditGoalsButton
            goalValue={goal}
            nutrient={nutrient}
            setGoals={setGoals}
          />
        </CardTitle>
        <CardDescription>
          {`You haven't entered any data for ${MacronutrientMap[
            nutrient
          ].toLowerCase()} yet.`}
        </CardDescription>
        <CardDescription>
          {`To get progress on your
        ${MacronutrientMap[
          nutrient
        ].toLowerCase()} goals for the day, log food and check again!`}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
