"use client";

import { FrontBody } from "@/components/ui/body";

import NoResponse from "@/components/ui/NoResponseCard";
import { frontBodyParts } from "@/components/ui/body-part";
import { DataTable } from "@/components/ui/datatable";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Columns } from "./columns";
import {
	type ExerciseEntry,
	type ExerciseRangeResponse,
	useGetExerciseRange,
} from "./entry.service";
export default function ExerciseBreakdown({
	className,
	startDate,
	endDate,
}: {
	className?: string;
	startDate: Date;
	endDate: Date;
}) {
	const { data, isPending, refetch, isError } = useGetExerciseRange({
		startDate,
		endDate,
	});

	const [frontBody, setFrontBody] = useState(() =>
		initCategories(frontBodyParts),
	);

	useEffect(() => {
		if (data) {
			setFrontBody(countAndScaleCategories(data, frontBodyParts));
		}
	}, [data]);
	const handleDeleted = () => {
		refetch();
	};
	const handleEdited = () => {
		refetch();
	};

	if (isPending) return;
	if (isError) {
		return (
			<NoResponse
				title="No exercise entries found"
				description="No exercise entries found in the given range"
			/>
		);
	}

	const createTransparentColor = (percent: number) =>
		`color-mix(in srgb, var(--protein) ${percent}%, transparent)`;
	return (
		<div
			className={cn(
				"flex flex-col w-3/4 mx-auto gap-4 items-center sm:flex-row sm:items-start",
				className,
			)}
		>
			<FrontBody
				className="w-3/4"
				styles={{
					outline: "var(--foreground)",
					calves: createTransparentColor(frontBody.calves),
					quads: createTransparentColor(frontBody.quads),
					abs: createTransparentColor(frontBody.abs),
					biceps: createTransparentColor(frontBody.biceps),
					obliques: createTransparentColor(frontBody.obliques),
					hands: createTransparentColor(frontBody.hands),
					forearms: createTransparentColor(frontBody.forearms),
					"front-shoulders": createTransparentColor(
						frontBody["front-shoulders"],
					),
					chest: createTransparentColor(frontBody.chest),
					traps: createTransparentColor(frontBody.traps),
				}}
			/>
			<DataTable<ExerciseEntry, unknown>
				columns={Columns({ handleDeleted, handleEdited })}
				data={data}
			/>
		</div>
	);
}

function countAndScaleCategories<T extends readonly string[]>(
	entries: ExerciseRangeResponse,
	bodySide: T,
): Record<T[number], number> {
	type MuscleGroup = T[number];

	const initialCounts = initCategories(bodySide);

	const counts = entries.reduce((acc: Record<MuscleGroup, number>, entry) => {
		const category = entry.category_name.toLowerCase() as MuscleGroup;
		if (bodySide.includes(category)) {
			acc[category] += entry.value;
		}
		return acc;
	}, initialCounts);

	const maxCount = Math.max(...(Object.values(counts) as number[]));

	const scaledCounts = Object.fromEntries(
		Object.entries(counts).map(([category, count]) => [
			category,
			//@ts-expect-error count unknown
			maxCount > 0 ? Math.round((count / maxCount) * 100) : 0,
		]),
	) as Record<MuscleGroup, number>;

	return scaledCounts;
}

function initCategories<T extends readonly string[]>(bodySide: T) {
	type MuscleGroup = T[number];
	return Object.fromEntries(bodySide.map((group) => [group, 0])) as Record<
		MuscleGroup,
		number
	>;
}
