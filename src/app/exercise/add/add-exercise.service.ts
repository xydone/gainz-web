import { User, useUserContext } from "@/app/context";
import { axiosInstance } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { FormSchema } from "./exercise";

export function useGetCategory() {
  const user = useUserContext();
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/exercise/category`,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return useQuery({
    queryKey: ["getExerciseCategory", user.accessToken],
    enabled: !user.loading,
    queryFn: fetchData,
  });
}

export const postExercise = (data: z.infer<typeof FormSchema>, user: User) => {
  return axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_URL}/exercise/`,
    { ...data },
    { headers: { Authorization: `Bearer ${user.accessToken}` } }
  );
};
