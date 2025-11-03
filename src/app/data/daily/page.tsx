"use client";
import { MealCateogies } from "@/app/types";
import { DataTable } from "@/components/ui/datatable";
import { DatePicker } from "@/components/ui/datepicker";
import { useState } from "react";
import { Column } from "./columns";
import { useGetEntryDay } from "./daily.service";

export default function Daily() {
	const [date, setDate] = useState<Date>(new Date());
	const { data, isPending, refetch, isError } = useGetEntryDay({
		date,
	});
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
			{isError && <h1>Not found.</h1>}
			{!isError &&
				!isPending &&
				Object.values(MealCateogies).map((category, i) => {
					const categorized = data.filter(
						(line) => line.category === category.toLowerCase(),
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
