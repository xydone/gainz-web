import { useUserContext } from "@/app/context";
import { axiosInstance } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export const useGetEntryDay = ({ date }: { date: Date }) => {
	const user = useUserContext();
	const dateString = format(date, "yyyy-MM-dd");
	const fetchData = async () => {
		const response = await axiosInstance.get(
			`${process.env.NEXT_PUBLIC_API_URL}/user/entry?&range_start=${dateString}&range_end=${dateString}`,
		);
		return response.data;
	};
	return useQuery({
		queryKey: ["entryDay", dateString, user.accessToken],
		queryFn: fetchData,
	});
};
