"use client";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/app/context";
import { axiosInstance } from "@/lib/api";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/datatable";
import { columns, Food } from "./columns";

export default function Search() {
  const [searchParam, setSearchParam] = useState<string | null>(null);
  const [searchResponse, setSearchResponse] = useState<Food[] | null>(null);
  const [recentResponse, setRecentResponse] = useState<Food[] | null>(null);
  const user = useUserContext();
  useEffect(() => {
    axiosInstance
      .get(`${process.env.NEXT_PUBLIC_API_URL}/user/entry/recent?limit=30`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then((response) => {
        setRecentResponse(response.data);
      });
  }, [user.accessToken]);

  const searchFood = () => {
    axiosInstance
      .get(`${process.env.NEXT_PUBLIC_API_URL}/food?search=${searchParam}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then((response) => {
        setSearchResponse(response.data);
      });
  };
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
        onClick={searchFood}
        disabled={!user.isSignedIn}
      >
        Search
      </Button>
      {searchResponse && (
        <DataTable columns={columns} data={searchResponse} paginated={true} />
      )}
      {!searchResponse && recentResponse && (
        <div className="grid place-items-center">
          <h1>Recently added:</h1>
          <DataTable columns={columns} data={recentResponse} paginated={true} />
        </div>
      )}
    </div>
  );
}
