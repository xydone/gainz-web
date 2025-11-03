import { useUserContext } from "@/app/context";
import { axiosInstance } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
export const useGetFood = ({ id }: { id: number }) => {
	const user = useUserContext();
	const fetchData = async () => {
		const response = await axiosInstance.get(
			`${process.env.NEXT_PUBLIC_API_URL}/food/${id}`,
		);
		return response.data;
	};
	return useQuery({
		queryKey: ["getFood", user.accessToken],
		queryFn: fetchData,
		enabled: false,
	});
};

export const useDeleteEntry = ({
	id,
	callback,
}: {
	id: number;
	callback: () => void;
}) => {
	return useMutation({
		mutationFn: async () => {
			const response = await axiosInstance.delete(
				`${process.env.NEXT_PUBLIC_API_URL}/user/entry/${id}`,
			);
			return response.data;
		},
		onSuccess: callback,
	});
};

export const useEditEntry = ({
	id,
	category,
	amount,
	serving_id,
	callback,
}: {
	id: number;
	category: string;
	amount: number;
	serving_id: number;
	callback: () => void;
}) => {
	return useMutation({
		mutationFn: async () => {
			const response = await axiosInstance.put(
				`${process.env.NEXT_PUBLIC_API_URL}/user/entry/${id}`,
				{
					meal_category: category,
					amount: amount,
					serving_id,
				},
			);
			return response.data;
		},
		onSuccess: callback,
	});
};
