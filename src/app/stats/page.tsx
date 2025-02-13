"use client";
import { useUserContext } from "../context";
import { axiosInstance } from "@/lib/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CustomBarChart from "../components/CustomBarChart";
import { DatePickerWithRange } from "@/components/ui/datepicker";

import { subDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import NoResponse from "./NoResponse";

interface MacronutrientDataPoint {
  macronutrient: string;
  value: number;
}

const MacronutrientMap: { [key: string]: string } = {
  calories: "Calories",
  fat: "Fat",
  sat_fat: "Saturated Fat",
  polyunsat_fat: "Polyunsaturated Fat",
  monounsat_fat: "Monounsaturated Fat",
  trans_fat: "Trans Fat",
  cholesterol: "Cholesterol",
  sodium: "Sodium",
  potassium: "Potassium",
  carbs: "Carbs",
  fiber: "Fiber",
  sugar: "Sugar",
  protein: "Protein",
  vitamin_a: "Vitamin A",
  vitamin_c: "Vitamin C",
  calcium: "Calcium",
  iron: "Iron",
  added_sugars: "Added Sugars",
  vitamin_d: "Vitamin D",
  sugar_alcohols: "Sugar Alcohols",
};

export default function Stats() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const { accessToken, isSignedIn } = useUserContext();
  const [isResponseOkay, setResponseOkay] = useState<boolean | null>(null);

  const [APIResponse, setAPIResponse] = useState<
    MacronutrientDataPoint[] | null
  >(null);

  const fetchAPI = async () => {
    if (accessToken === null) {
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
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then((response) => {
        const transformed: MacronutrientDataPoint[] = [];
        const keys = Object.keys(response.data);
        for (const key of keys) {
          transformed.push({
            macronutrient: MacronutrientMap[key],
            value: Math.round(response.data[key]),
          });
        }
        setAPIResponse(transformed);
      })
      .catch(() => {
        setResponseOkay(false);
        setAPIResponse(null);
      });
  };
  return (
    <div className="mt-5 flex flex-col justify-center items-center gap-4">
      <h1 className="text-xl">Search for food</h1>
      <DatePickerWithRange className={""} date={date} setDate={setDate} />
      <Button
        id="date"
        variant={"outline"}
        className={"mt-3"}
        onClick={fetchAPI}
        disabled={!isSignedIn}
      >
        Submit
      </Button>
      {APIResponse && <CustomBarChart chartData={APIResponse} />}
      {isResponseOkay == false && <NoResponse />}
    </div>
  );
}
