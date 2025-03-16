import { useUserContext } from "@/app/context";
import { axiosInstance } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useGetRecent = () => {
  const user = useUserContext();
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/entry/recent?limit=30`,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return useQuery({
    queryKey: ["getExercises", user.accessToken],
    queryFn: fetchData,
    enabled: !user.loading,
  });
};

export const useSearchFood = ({
  searchParam,
}: {
  searchParam: string | null;
}) => {
  const user = useUserContext();
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/food?search=${searchParam}`,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  return useQuery({
    queryKey: ["searchFood", user.accessToken],
    queryFn: fetchData,
    enabled: false,
  });
};
