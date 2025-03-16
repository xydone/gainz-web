import { useUserContext } from "@/app/context";
import { axiosInstance } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
export const useGetFood = ({ id }: { id: number }) => {
  const user = useUserContext();
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/food/${id}`,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  return useQuery({
    queryKey: ["getFood", user.accessToken],
    queryFn: fetchData,
    enabled: false,
  });
};

// export const useDeleteEntry = ({ id }: { id: number }) => {
//   const user = useUserContext();
//   const fetchData = async () => {
//     try {
//       const response = await axiosInstance.delete(
//         `${process.env.NEXT_PUBLIC_API_URL}/user/entry/${id}`,
//         { headers: { Authorization: `Bearer ${user.accessToken}` } }
//       );
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   };
//   return useQuery({
//     queryKey: ["deleteEntry", user.accessToken],
//     queryFn: fetchData,
//     enabled: false,
//   });
// };
export const useDeleteEntry = ({
  id,
  callback,
}: {
  id: number;
  callback: () => void;
}) => {
  const user = useUserContext();

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await axiosInstance.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/user/entry/${id}`,
          { headers: { Authorization: `Bearer ${user.accessToken}` } }
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: callback,
  });
};

export const useEditEntry = ({
  id,
  category,
  amount,
  serving_id,
  callback,
}: {
  id: number;
  category: string;
  amount: number;
  serving_id: number;
  callback: () => void;
}) => {
  const user = useUserContext();

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await axiosInstance.put(
          `${process.env.NEXT_PUBLIC_API_URL}/user/entry/${id}`,
          {
            meal_category: category,
            amount: amount,
            serving_id,
          },
          { headers: { Authorization: `Bearer ${user.accessToken}` } }
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: callback,
  });
};
