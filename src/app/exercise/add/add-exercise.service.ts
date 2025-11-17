import { useUserContext } from "@/app/context";
import { axiosInstance } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { z } from "zod";
import type { FormSchema } from "./exercise";
import type { FormSchema as CategorySchema } from "./category";
export function useGetCategories() {
	const user = useUserContext();
	const fetchData = async () => {
		const response = await axiosInstance.get(
			`${process.env.NEXT_PUBLIC_API_URL}/exercise/category`,
		);
		return response.data;
	};

	return useQuery({
		queryKey: ["getExerciseCategories", user.accessToken],
		enabled: !user.loading,
		queryFn: fetchData,
	});
}

export const postExercise = (data: z.infer<typeof FormSchema>) => {
	return axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/exercise/`, {
		...data,
	});
};

export const postCategory = (data: z.infer<typeof CategorySchema>) => {
	return axiosInstance.post(
		`${process.env.NEXT_PUBLIC_API_URL}/exercise/category`,
		{ ...data },
	);
};
