import { useUserContext } from "@/app/context";
import { axiosInstance } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export const useGetEntry = ({
	from,
	to,
}: {
	from: Date | undefined;
	to: Date | undefined;
}) => {
	const user = useUserContext();
	const fromString = from ? format(from, "yyyy-MM-dd") : undefined;
	const toString = to ? format(to, "yyyy-MM-dd") : undefined;
	const fetchData = async () => {
		const response = await axiosInstance.get(
			`${process.env.NEXT_PUBLIC_API_URL}/user/entry?range_start=${fromString}&range_end=${toString}`,
			{ headers: { Authorization: `Bearer ${user.accessToken}` } },
		);
		return response.data;
	};
	return useQuery({
		queryKey: ["entryDay", fromString, toString, user.accessToken],
		queryFn: fetchData,
		enabled: !(user.loading || from === undefined || to === undefined),
	});
};
