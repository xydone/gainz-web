"use client";
import CustomBarChart from "@/components/ui/CustomBarChart";

import NoResponse from "./NoResponse";
import { useUserContext } from "../context";
import { axiosInstance } from "@/lib/api";
import { MacronutrientMap } from "@/app/types";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
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
  date: DateRange;
}) {
  const user = useUserContext();
  const [isResponseOkay, setResponseOkay] = useState<boolean | null>(null);
  const [data, setData] = useState<MacronutrientDataPoint[] | null>(null);
  const [displayDate, setDisplayDate] = useState<IDate | undefined>();

  useEffect(() => {
    if (user.accessToken === null) {
      throw new Error("Access token is null!");
    }

    //annoying little thing we have to do because of errors
    if (date == undefined || date.from == undefined || date.to == undefined)
      throw new Error("Dates are not defined");
    axiosInstance
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/entry/stats?&start=${format(
          date.from,
          "yyyy-MM-dd"
        )}&end=${format(date.to, "yyyy-MM-dd")}`,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      )
      .then((response) => {
        const transformed: MacronutrientDataPoint[] = [];
        const keys = Object.keys(response.data);
        for (const key of keys) {
          if (date.from == undefined || date.to == undefined) return;
          setDisplayDate({ from: date.from, to: date.to });
          transformed.push({
            macronutrient: MacronutrientMap[key],
            value: Math.round(response.data[key]),
          });
        }
        setData(transformed);
        setResponseOkay(true);
      })
      .catch(() => {
        setResponseOkay(false);
        setData(null);
      });
  }, [date, user.accessToken]);
  if (isResponseOkay == false)
    return (
      <NoResponse
        title="No entries found"
        description="No entries found in the given range"
      />
    );
  return (
    data && (
      <CustomBarChart
        className={cn("", className)}
        chartData={data}
        date={displayDate}
      />
    )
  );
}
