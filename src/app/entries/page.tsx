"use client";
import { DatePickerWithRange } from "@/components/ui/datepicker";
import { Button } from "@/components/ui/button";
import { subDays, format } from "date-fns";
import { useState } from "react";
import { useUserContext } from "../context";
import { DataTable } from "@/components/ui/datatable";
import { columns, Entry } from "./columns";
import { DateRange } from "react-day-picker";

export default function Entries() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const { accessToken, isSignedIn } = useUserContext();
  const [APIResponse, setAPIResponse] = useState<Entry[] | null>(null);

  const fetchAPI = async () => {
    if (accessToken === null) {
      throw new Error("Access token is null!");
    }
    const headers: HeadersInit = {
      "x-access-token": accessToken,
    };

    try {
      //annoying little thing we have to do because of errors
      if (date == undefined || date.from == undefined || date.to == undefined)
        throw new Error("Dates are not defined");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/entry?start=${format(
          date.from,
          "yyyy-MM-dd"
        )}&end=${format(date.to, "yyyy-MM-dd")}`,
        {
          headers: headers,
        }
      );
      const json = await response.json();
      setAPIResponse(json);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <>
      <div className="grid justify-center">
        <h1 className="text-center text-xl m-5">Select the range</h1>
        <DatePickerWithRange className={""} date={date} setDate={setDate} />
        <Button
          id="date"
          variant={"outline"}
          className={"mt-10"}
          onClick={fetchAPI}
          disabled={!isSignedIn}
        >
          Submit
        </Button>
      </div>
      {APIResponse && <DataTable columns={columns} data={APIResponse} />}
    </>
  );
}
