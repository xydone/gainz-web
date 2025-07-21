"use client";
import CustomBarChart from "@/components/ui/CustomBarChart";
import NoResponse from "../../../components/ui/NoResponseCard";
import { MacronutrientMap } from "@/app/types";
import { cn } from "@/lib/utils";
import { useGetEntryStats } from "./progress.service";

interface MacronutrientDataPoint {
  macronutrient: string;
  value: number;
}

interface IDate {
  from: Date;
  to: Date;
}

export default function EntriesProgress({
  className,
  date,
}: {
  className?: string;
  date: IDate;
}) {
  const { data, isLoading, error } = useGetEntryStats({
    startDate: date.from,
    endDate: date.to,
  });
  if (isLoading) return;
  if (error) {
    return (
      <NoResponse
        title="No entries found"
        description="No entries found in the given range"
      />
    );
  }

  const processedData = data ? processData() : [];

  function processData() {
    const transformed: MacronutrientDataPoint[] = [];

    if (!date?.from || !date?.to) {
      return [];
    }

    const keys = Object.keys(data);
    for (const key of keys) {
      transformed.push({
        macronutrient: MacronutrientMap[key] || key,
        value: Math.round(data[key]),
      });
    }
    return transformed;
  }

  return (
    <CustomBarChart
      className={cn("", className)}
      chartData={processedData}
      date={date}
    />
  );
}
