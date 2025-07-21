"use client";

import { useUserContext } from "../../context";
import Loading from "../../loading";
import { redirect } from "next/navigation";

import { useState } from "react";
import { DatePickerWithRange } from "@/components/ui/datepicker";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import { DefinedDateRange } from "@/app/data/progress/page";
import { Button } from "@/components/ui/button";
import ExerciseBreakdown from "./breakdown";

export default function ExerciseData() {
  const user = useUserContext();

  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [submit, setSubmit] = useState<boolean>(false);

  //used for updating the date in the chart only when the submit is clicked
  //using date,setDate above would cause the chart to update every time the range was changed, without the data in the chart getting changed
  const [displayDate, setDisplayDate] = useState<DefinedDateRange>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const onClick = () => {
    if (!date || !date.from || !date.to) return;
    setSubmit(true);
    setDisplayDate({ from: date.from, to: date.to });
  };

  if (user.loading) return <Loading />;
  if (!user.isSignedIn) return redirect("/");

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <h1 className="text-xl">View Exercise Info</h1>
      <DatePickerWithRange className={""} date={date} setDate={setDate} />
      <Button
        id="date"
        variant={"outline"}
        className={"mt-3"}
        onClick={onClick}
        disabled={!user.isSignedIn}
      >
        Submit
      </Button>
      {submit && (
        <ExerciseBreakdown
          startDate={displayDate.from}
          endDate={displayDate.to}
        />
      )}
    </div>
  );
}
