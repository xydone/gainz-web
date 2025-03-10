"use client";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/app/context";
import { axiosInstance } from "@/lib/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/datatable";
import { columns } from "./columns";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function Search() {
  const [searchParam, setSearchParam] = useState<string | null>(null);
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

  const { data } = useQuery({
    queryKey: ["getExercises"],
    queryFn: fetchData,
  });

  const { mutate, data: searchData } = useMutation({
    mutationFn: async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.NEXT_PUBLIC_API_URL}/food?search=${searchParam}`,
          { headers: { Authorization: `Bearer ${user.accessToken}` } }
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <h1 className="text-xl">Search for food</h1>
      <Input
        type="text"
        className="w-2/3 sm:w-1/3"
        placeholder="Type to search..."
        disabled={!user.isSignedIn}
        onChange={(e) => setSearchParam(e.target.value)}
      />

      <Button
        type="submit"
        variant={"outline"}
        className={"mt-3"}
        // @ts-expect-error Weird form error
        onClick={mutate}
        disabled={!user.isSignedIn}
      >
        Search
      </Button>
      {searchData && (
        <DataTable columns={columns} data={searchData} paginated={true} />
      )}
      {!searchData && data && (
        <div className="grid place-items-center">
          <h1>Recently added:</h1>
          <DataTable columns={columns} data={data} paginated={true} />
        </div>
      )}
    </div>
  );
}
