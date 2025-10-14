import { useUserContext } from "@/app/context";
import { axiosInstance } from "@/lib/api";
import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { useState } from "react";

export interface Exercise {
  id: number;
  name: string;
  description: string | null;
}

export type ExerciseResponse = Exercise[];

export const useGetExercises = () => {
  const user = useUserContext();
  const [lastFail, setLastFail] = useState<boolean>(false);
  const fetchData = async (): Promise<ExerciseResponse> => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/exercise`
      );
      setLastFail(false);
      return response.data;
    } catch (error) {
      setLastFail(true);
      throw error;
    }
  };
  return useQuery({
    queryKey: ["exerciseRange", user.accessToken],
    queryFn: fetchData,
    enabled: !user.loading,
    staleTime: 10 * 1000, //10s
    placeholderData: lastFail ? undefined : keepPreviousData,
  });
};

export const useLogExercise = ({
  exercise_id,
  unit_id,
  value,
  notes,
  callback,
}: {
  exercise_id: number;
  unit_id: number;
  value: number;
  notes: string | null;
  callback: () => void;
}) => {
  return useMutation({
    mutationFn: async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.NEXT_PUBLIC_API_URL}/exercise/entry`,
          {
            exercise_id,
            unit_id,
            value,
            notes,
          }
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: callback,
  });
};
