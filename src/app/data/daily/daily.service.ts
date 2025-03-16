import { useUserContext } from "@/app/context";
import { axiosInstance } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export const useGetEntryDay = ({ date }: { date: Date }) => {
  const user = useUserContext();
  const dateString = format(date, "yyyy-MM-dd");
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/entry?&start=${dateString}&end=${dateString}`,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return useQuery({
    queryKey: ["entryDay", dateString, user.accessToken],
    queryFn: fetchData,
    enabled: !user.loading,
    placeholderData: (prev) => prev,
  });
};
