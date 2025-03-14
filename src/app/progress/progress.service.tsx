import { axiosInstance } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "../context";
import { format } from "date-fns";

export const useGetDetailedStats = ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  const user = useUserContext();
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/user/entry/stats/detailed?&start=${format(
          startDate,
          "yyyy-MM-dd"
        )}&end=${format(endDate, "yyyy-MM-dd")}`,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
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

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/entry/stats`,
        {
          params: {
            start: format(startDate, "yyyy-MM-dd"),
            end: format(endDate, "yyyy-MM-dd"),
          },
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return useQuery({
    queryKey: ["entries", startDate, endDate, user.accessToken],
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
    try {
      const response = await axiosInstance.get(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/user/measurement?type=weight&start=${format(
          startDate,
          "yyyy-MM-dd"
        )}&end=${format(endDate, "yyyy-MM-dd")}`,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return useQuery({
    queryKey: ["weight", startDate, endDate, user.accessToken],
    queryFn: fetchData,
  });
};
