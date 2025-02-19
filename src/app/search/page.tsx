"use client";
import { Input } from "@/components/ui/input";
import { useUserContext } from "../context";
import { axiosInstance } from "@/lib/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/datatable";
import { columns, Food } from "./columns";

export default function Search() {
  const [searchParam, setSearchParam] = useState<string | null>(null);
  const [APIResponse, setAPIResponse] = useState<Food[] | null>(null);
  const user = useUserContext();

  const searchFood = () => {
    axiosInstance
      .get(`${process.env.NEXT_PUBLIC_API_URL}/food?search=${searchParam}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then((response) => {
        setAPIResponse(response.data);
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
      {APIResponse && (
        <DataTable columns={columns} data={APIResponse} paginated={true} />
      )}
    </div>
  );
}
