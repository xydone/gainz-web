"use client";
import { useState } from "react";
import { useGetEntryDay } from "./daily.service";
import { DataTable } from "@/components/ui/datatable";
import { MealCateogies } from "@/app/types";
import { DatePicker } from "@/components/ui/datepicker";
import { Column } from "./columns";

export default function Daily() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { data, isPending, refetch } = useGetEntryDay({ date });
  if (isPending) return;
  const handleDeleted = () => {
    refetch();
  };
  const handleEdited = () => {
    refetch();
  };
  return (
    <div className="flex flex-col place-items-center gap-3">
      <h1 className="text-xl">View Daily Intake Logs</h1>
      <DatePicker date={date} setDate={setDate} />
      {Object.values(MealCateogies).map((category, i) => {
        const categorized = data.filter(
          (line) => line.category == category.toLowerCase()
        );
        return (
          <div key={i} className="text-center gap-5">
            <h1>{category}</h1>
            <DataTable
              columns={Column({ handleDeleted, handleEdited })}
              data={categorized}
            />
          </div>
        );
      })}
    </div>
  );
}
