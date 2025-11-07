"use client";

import Body, { SlugList } from "@/components/ui/body/index";
import NoResponse from "@/components/ui/NoResponseCard";
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

	const [slug, setSlug] = useState(() => initCategories(SlugList));

	useEffect(() => {
		if (data) {
			setSlug(countAndScaleCategories(data, SlugList));
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
	const bodyData = Object.keys(slug).map((key) => {
		return { slug: key, intensity: slug[key] };
	});
	console.log(bodyData);
	return (
		<div
			className={cn(
				"flex flex-col w-3/4 mx-auto gap-4 items-center sm:flex-row sm:items-start",
				className,
			)}
		>
			<Body data={bodyData} gender="male" side="front" scale={1.7} />

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
