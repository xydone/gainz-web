import { useUserContext } from "@/app/context";
import { axiosInstance } from "@/lib/api";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

export interface Exercise {
	id: number;
	name: string;
	description: string | null;
}

export type ExerciseResponse = Exercise[];

export const useGetExercises = () => {
	const user = useUserContext();
	const fetchData = async (): Promise<ExerciseResponse> => {
		const response = await axiosInstance.get(
			`${process.env.NEXT_PUBLIC_API_URL}/exercise`,
		);
		return response.data;
	};
	return useQuery({
		queryKey: ["exerciseRange", user.accessToken],
		queryFn: fetchData,
		enabled: !user.loading,
	});
};

export const useLogExercise = ({
	exercise_id,
	unit_id,
	value,
	notes,
	callback,
}: {
	exercise_id: number;
	unit_id: number;
	value: number;
	notes: string | null;
	callback: () => void;
}) => {
	return useMutation({
		mutationFn: async () => {
			const response = await axiosInstance.post(
				`${process.env.NEXT_PUBLIC_API_URL}/exercise/entry`,
				{
					exercise_id,
					unit_id,
					value,
					notes,
				},
			);
			return response.data;
		},
		onSuccess: callback,
	});
};
