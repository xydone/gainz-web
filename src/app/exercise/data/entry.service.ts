import { useUserContext } from "@/app/context";
import { axiosInstance } from "@/lib/api";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";

export interface ExerciseEntry {
  entry_id: number;
  entry_created_at: number;
  created_by: number;
  exercise_id: number;
  exercise_name: string;
  exercise_description: string | null;
  value: number;
  unit_id: number;
  unit_name: string;
  unit_amount: number;
  unit_multiplier: number;
  notes: string | null;
  category_id: number;
  category_name: string;
  category_description: string | null;
}

export type ExerciseRangeResponse = ExerciseEntry[];

export const useGetExerciseRange = ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  const user = useUserContext();
  const [lastFail, setLastFail] = useState<boolean>(false);
  const start = format(startDate, "yyyy-MM-dd");
  const end = format(endDate, "yyyy-MM-dd");
  const fetchData = async (): Promise<ExerciseRangeResponse> => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/exercise/entry/range?&start=${start}&end=${end}`
      );
      setLastFail(false);
      return response.data;
    } catch (error) {
      setLastFail(true);
      throw error;
    }
  };
  return useQuery({
    queryKey: ["exerciseRange", startDate, endDate, user.accessToken],
    queryFn: fetchData,
    enabled: !user.loading,
    staleTime: 10 * 1000, //10s
    placeholderData: lastFail ? undefined : keepPreviousData,
  });
};
