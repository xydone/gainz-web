"use client";
import CustomBarChart from "@/components/ui/CustomBarChart";
import NoResponse from "./NoResponse";
import { useUserContext } from "../context";
import { axiosInstance } from "@/lib/api";
import { MacronutrientMap } from "@/app/types";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

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
  const user = useUserContext();

  const fetchData = async () => {
    if (!date?.from || !date?.to) {
      throw new Error("Dates are not defined");
    }

    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/entry/stats`,
        {
          params: {
            start: format(date.from, "yyyy-MM-dd"),
            end: format(date.to, "yyyy-MM-dd"),
          },
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const { data, error } = useQuery({
    queryKey: ["entries", date],
    queryFn: fetchData,
  });

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
