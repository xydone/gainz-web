"use client";
import { useUserContext } from "@/app/context";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/datepicker";

import { format, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import EntriesProgress from "./entries";
import Weight from "./weight";
import GoalsPercentage from "./goals-percentage";

export interface DefinedDateRange {
  from: Date;
  to: Date;
}

export default function Progress() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  //used for updating the date in the chart only when the submit is clicked
  //using date,setDate above would cause the chart to update every time the range was changed, without the data in the chart getting changed
  const [displayDate, setDisplayDate] = useState<DefinedDateRange>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const [submit, setSubmit] = useState<boolean>(false);

  const user = useUserContext();

  const onClick = () => {
    if (!date || !date.from || !date.to) return;
    setSubmit(true);
    setDisplayDate({ from: date.from, to: date.to });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <h1 className="text-xl">View Progress</h1>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-4">
          <EntriesProgress date={displayDate} />
          <Weight
            startDate={format(displayDate.from, "yyyy-MM-dd")}
            endDate={format(displayDate.to, "yyyy-MM-dd")}
          />
          <GoalsPercentage
            startDate={format(displayDate.from, "yyyy-MM-dd")}
            endDate={format(displayDate.to, "yyyy-MM-dd")}
          />
        </div>
      )}
    </div>
  );
}
