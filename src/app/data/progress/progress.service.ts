import { axiosInstance } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { User, useUserContext } from "../../context";
import { format } from "date-fns";
import { z } from "zod";

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

export const useGetGoals = () => {
  const user = useUserContext();
  const fetchGoals = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/goals`,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
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

export const setMeasurement = (data: SetMeasurement, user: User) => {
  return axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_URL}/user/measurement`,
    { ...data },
    { headers: { Authorization: `Bearer ${user.accessToken}` } }
  );
};
