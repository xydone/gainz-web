"use client";
import { useUserContext } from "@/app/context";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/datatable";
import { DatePickerWithRange } from "@/components/ui/datepicker";
import { subDays } from "date-fns";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { columns } from "./columns";
import { useGetEntry } from "./entry.service";

export default function Entries() {
	const [date, setDate] = useState<DateRange | undefined>({
		from: subDays(new Date(), 7),
		to: new Date(),
	});
	const { isSignedIn } = useUserContext();

	const { data, refetch } = useGetEntry({ from: date?.from, to: date?.to });

	const handleClick = () => {
		if (date === undefined) return;
		refetch();
	};

	return (
		<>
			<div className="flex flex-col items-center justify-center gap-4">
				<h1 className="text-center text-xl ">View Raw Data</h1>
				<DatePickerWithRange className={""} date={date} setDate={setDate} />
				<Button
					id="date"
					variant={"outline"}
					className={"mt-3"}
					onClick={handleClick}
					disabled={!isSignedIn}
				>
					Submit
				</Button>
			</div>
			{data && <DataTable columns={columns} data={data} paginated={true} />}
		</>
	);
}
