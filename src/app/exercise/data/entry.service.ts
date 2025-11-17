import { useUserContext } from "@/app/context";
import { axiosInstance } from "@/lib/api";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";

export interface ExerciseEntry {
	entry_id: number;
	entry_created_at: number;
	created_by: number;
	exercise_id: number;
	exercise_name: string;
	exercise_description: string | null;
	value: number;
	unit_id: number;
	unit_name: string;
	unit_amount: number;
	unit_multiplier: number;
	notes: string | null;
	category_id: number;
	category_name: string;
	category_description: string | null;
}

export type ExerciseRangeResponse = ExerciseEntry[];

export const useGetExerciseRange = ({
	startDate,
	endDate,
}: {
	startDate: Date;
	endDate: Date;
}) => {
	const user = useUserContext();
	const [lastFail, setLastFail] = useState<boolean>(false);
	const start = format(startDate, "yyyy-MM-dd");
	const end = format(endDate, "yyyy-MM-dd");
	const fetchData = async (): Promise<ExerciseRangeResponse> => {
		try {
			const response = await axiosInstance.get(
				`${process.env.NEXT_PUBLIC_API_URL}/exercise/entry/range?&range_start=${start}&range_end=${end}`,
			);
			setLastFail(false);
			return response.data;
		} catch (error) {
			setLastFail(true);
			throw error;
		}
	};
	return useQuery({
		queryKey: ["exerciseRange", start, end, user.accessToken],
		queryFn: fetchData,
		enabled: !user.loading,
	});
};

export interface ExerciseUnit {
	id: number;
	created_at: number;
	created_by: number;
	amount: number;
	unit: string;
	multiplier: number;
}

export type ExerciseUnitResponse = ExerciseUnit[];

export const useGetExerciseUnits = () => {
	const user = useUserContext();
	const fetchData = async (): Promise<ExerciseUnitResponse> => {
		const response = await axiosInstance.get(
			`${process.env.NEXT_PUBLIC_API_URL}/exercise/unit`,
		);
		return response.data;
	};
	return useQuery({
		queryKey: ["exerciseUnits", user.accessToken],
		queryFn: fetchData,
		enabled: !user.loading,
	});
};

export const useEditExerciseEntry = ({
	entry_id,
	exercise_id,
	value,
	unit_id,
	notes,
	callback,
}: {
	entry_id: number;
	exercise_id: number;
	value: number;
	unit_id: number;
	notes: string | null;
	callback: () => void;
}) => {
	return useMutation({
		mutationFn: async () => {
			const response = await axiosInstance.put(
				`${process.env.NEXT_PUBLIC_API_URL}/exercise/entry/${entry_id}`,
				{
					exercise_id,
					value,
					unit_id,
					notes,
				},
			);
			return response.data;
		},
		onSuccess: callback,
	});
};

export const useDeleteExerciseEntry = ({
	id,
	callback,
}: {
	id: number;
	callback: () => void;
}) => {
	return useMutation({
		mutationFn: async () => {
			const response = await axiosInstance.delete(
				`${process.env.NEXT_PUBLIC_API_URL}/exercise/entry/${id}`,
			);
			return response.data;
		},
		onSuccess: callback,
	});
};
