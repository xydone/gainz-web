import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useUserContext } from "@/app/context";
import { axiosInstance } from "../api";
export const useGetPredictedWeight = ({ date }: { date: Date }) => {
	const user = useUserContext();
	const dateString = format(date, "yyyy-MM-dd");
	const fetchData = async () => {
		const response = await axiosInstance.get(
			`${process.env.NEXT_PUBLIC_API_URL}/user/analytics/weight/predict/${dateString}`,
		);
		return response.data;
	};
	return useQuery({
		queryKey: ["getPredictedWeight", user.accessToken, dateString],
		queryFn: fetchData,
	});
};
