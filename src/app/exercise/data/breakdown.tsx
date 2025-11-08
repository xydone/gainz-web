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
import { Button } from "@/components/ui/button";
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
	const [isFront, setFront] = useState<boolean>(true);
	const [isMale, setMale] = useState<boolean>(true);

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
	return (
		<div
			className={cn(
				"flex flex-col w-full mx-4 lg:flex-row lg:items-start lg:justify-center",
				className,
			)}
		>
			<div className="flex flex-col order-2 self-center items-center lg:order-1">
				<Body
					data={bodyData}
					sex={isMale ? "male" : "female"}
					scale={1}
					side={isFront ? "front" : "back"}
				/>
				<div className="flex flex-row gap-2">
					<Button variant="outline" onClick={() => setFront(!isFront)}>
						Rotate
					</Button>
					<Button variant="outline" onClick={() => setMale(!isMale)}>
						Change sex
					</Button>
				</div>
			</div>
			<div className="order-1 lg:order-2">
				<DataTable<ExerciseEntry, unknown>
					columns={Columns({ handleDeleted, handleEdited })}
					data={data}
				/>
			</div>
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
