import type { Measurements, Nutrients } from "@/app/types";
import { axiosInstance } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { z } from "zod";
import { useUserContext } from "../../context";

export const useGetDetailedStats = ({
	startDate,
	endDate,
}: {
	startDate: Date;
	endDate: Date;
}) => {
	const user = useUserContext();
	const fetchData = async () => {
		const response = await axiosInstance.get(
			`${
				process.env.NEXT_PUBLIC_API_URL
			}/user/entry/stats/detailed?&start=${format(
				startDate,
				"yyyy-MM-dd",
			)}&end=${format(endDate, "yyyy-MM-dd")}`,
		);
		return response.data;
	};

	return useQuery({
		queryKey: ["detailedStats", startDate, endDate, user.accessToken],
		queryFn: fetchData,
	});
};

export const useGetEntryStats = ({
	startDate,
	endDate,
}: {
	startDate: Date;
	endDate: Date;
}) => {
	const user = useUserContext();
	const startString = format(startDate, "yyyy-MM-dd");
	const endString = format(endDate, "yyyy-MM-dd");

	const fetchData = async (): Promise<Nutrients> => {
		const response = await axiosInstance.get<Nutrients>(
			`${process.env.NEXT_PUBLIC_API_URL}/user/entry/stats`,
			{
				params: {
					start: format(startDate, "yyyy-MM-dd"),
					end: format(endDate, "yyyy-MM-dd"),
				},
				headers: { Authorization: `Bearer ${user.accessToken}` },
			},
		);
		return response.data;
	};

	return useQuery({
		queryKey: ["entries", startString, endString, user.accessToken],
		queryFn: fetchData,
	});
};

export const useGetWeight = ({
	startDate,
	endDate,
}: {
	startDate: Date;
	endDate: Date;
}) => {
	const user = useUserContext();
	const fetchData = async () => {
		const response = await axiosInstance.get(
			`${
				process.env.NEXT_PUBLIC_API_URL
			}/user/measurement?type=weight&start=${format(
				startDate,
				"yyyy-MM-dd",
			)}&end=${format(endDate, "yyyy-MM-dd")}`,
		);
		return response.data;
	};

	return useQuery({
		queryKey: ["weight", startDate, endDate, user.accessToken],
		queryFn: fetchData,
	});
};

export interface GetGoals {
	id: number;
	target: string;
	value: number;
	created_at: number;
}

export const useGetGoals = () => {
	const user = useUserContext();
	const fetchGoals = async (): Promise<GetGoals[]> => {
		const response = await axiosInstance.get(
			`${process.env.NEXT_PUBLIC_API_URL}/user/goals`,
		);

		return response.data;
	};
	return useQuery<GetGoals[]>({
		queryKey: ["goals", user.accessToken],
		queryFn: fetchGoals,
	});
};

export const useGetActiveGoals = () => {
	const user = useUserContext();
	const fetchGoals = async () => {
		const response = await axiosInstance.get(
			`${process.env.NEXT_PUBLIC_API_URL}/user/goals/active`,
		);

		return response.data;
	};
	return useQuery({
		queryKey: ["goals", user.accessToken],
		queryFn: fetchGoals,
	});
};

export const SetMeasurementSchema = z.object({
	type: z.string().nonempty(),
	value: z.coerce.number({
		message: "Must be a number and cannot be empty!",
	}),
	date: z.string().date().optional(),
});

export type SetMeasurement = z.infer<typeof SetMeasurementSchema>;

export const setMeasurement = (data: SetMeasurement) => {
	return axiosInstance.post(
		`${process.env.NEXT_PUBLIC_API_URL}/user/measurement`,
		{ ...data },
	);
};

export const useGetMeasurement = (type: Measurements) => {
	const user = useUserContext();
	const fetchData = async () => {
		const response = await axiosInstance.get(
			`${process.env.NEXT_PUBLIC_API_URL}/user/measurement/recent?type=${type}`,
		);
		return response.data;
	};

	return useQuery({
		queryKey: ["measurements", type, user.accessToken],
		enabled: !user.loading,
		queryFn: fetchData,
	});
};
