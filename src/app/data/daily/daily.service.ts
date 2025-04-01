import { useUserContext } from "@/app/context";
import { axiosInstance } from "@/lib/api";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";

export const useGetEntryDay = ({ date }: { date: Date }) => {
  const user = useUserContext();
  const [lastFail, setLastFail] = useState<boolean>(false);
  const dateString = format(date, "yyyy-MM-dd");
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/entry?&start=${dateString}&end=${dateString}`,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      setLastFail(false);
      return response.data;
    } catch (error) {
      setLastFail(true);
      throw error;
    }
  };
  return useQuery({
    queryKey: ["entryDay", dateString, user.accessToken],
    queryFn: fetchData,
    enabled: !user.loading,
    staleTime: 10 * 1000, //10s
    placeholderData: lastFail ? undefined : keepPreviousData,
  });
};
