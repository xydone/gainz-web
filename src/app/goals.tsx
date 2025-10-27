import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Minus, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { axiosInstance } from "@/lib/api";
import { useUserContext } from "./context";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { MacronutrientMap } from "./types";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

export function GoalsCard({
  className,
  goalName,
  date,
}: {
  className?: string;
  goalName: string;
  date: Date;
}) {
  const user = useUserContext();
  const nutrientCaps = goalName[0].toUpperCase() + goalName.slice(1);
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/goals/active`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const { data: goalsData, isPending } = useQuery({
    queryKey: ["goals", user.accessToken],
    queryFn: fetchData,
  });

  const day = format(date, "yyyy-MM-dd");
  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/entry/stats?start=${day}&end=${day}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const { data: statsData } = useQuery({
    queryKey: ["stats", user.accessToken, date],
    queryFn: fetchStats,
  });
  if (isPending) {
    return <Loading />;
  }

  //if no intake, but goal data exists
  if (statsData == undefined && goalsData)
    return <NoDataCard nutrient={goalName} goal={goalsData[goalName]} />;
  //if no intake and no goals
  if (goalsData == undefined)
    return <NoDataCard nutrient={goalName} goal={0} />;
  //if no goals, but intake exists
  if (!goalsData[goalName]) return <NoGoalsCard nutrient={goalName} />;
  const percentage = Math.round(
    (statsData[goalName] / goalsData[goalName]) * 100
  );
  return (
    <Card className={cn("relative", className)}>
      <CardHeader>
        <CardTitle>
          {`${nutrientCaps} goals`}
          <CardDescription>Goal is {goalsData[goalName]}</CardDescription>
          <EditGoalsButton
            nutrient={goalName}
            goalValue={goalsData[goalName]}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full flex items-center justify-center gap-3">
        <Progress
          value={percentage}
          className={`border border-foreground/10 [&>div]:bg-nutrients-${goalName}`}
        />
        <span className="text-sm">{percentage}%</span>
      </CardContent>
    </Card>
  );
}

function EditGoalsButton({
  goalValue,
  nutrient,
}: {
  goalValue: number;
  nutrient: string;
}) {
  const user = useUserContext();
  const [goals, setGoals] = useState<number>(goalValue);
  function onClick(adjustment: number) {
    setGoals(goals + adjustment);
  }
  const submit = () => {
    axiosInstance
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/goals`,
        { target: nutrient, value: goals },
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      )
      .then(() => {
        setGoals(goals);
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
            Edit {MacronutrientMap[nutrient].toLowerCase()} goals
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-row items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 gap-0 shrink-0 rounded-full"
            onClick={() => onClick(-100)}
            disabled={goals <= 0}
          >
            <Minus /> <Minus />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 shrink-0 rounded-full"
            onClick={() => onClick(-10)}
            disabled={goals <= 0}
          >
            <Minus />
          </Button>

          <div className="flex-1 text-center">
            <div className="text-7xl font-bold tracking-tighter">{goals}</div>
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
        <DialogClose asChild>
          <Button variant="outline" onClick={submit}>
            Submit
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export function NoGoalsCard({
  className,
  nutrient,
}: {
  className?: string;
  nutrient: string;
}) {
  return (
    <Card className={cn("relative", className)}>
      <CardHeader>
        <CardTitle>
          No {MacronutrientMap[nutrient].toLowerCase()} goals!
          <EditGoalsButton goalValue={0} nutrient={nutrient} />
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
}: {
  className?: string;
  nutrient: string;
  goal: number;
}) {
  return (
    <Card className={cn("relative", className)}>
      <CardHeader>
        <CardTitle>
          No {MacronutrientMap[nutrient].toLowerCase()} data!
          <EditGoalsButton goalValue={goal} nutrient={nutrient} />
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

export function Loading() {
  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="flex flex-col gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-5 w-full relative mt-2">
          <Skeleton className="h-full w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
