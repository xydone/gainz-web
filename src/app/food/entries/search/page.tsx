"use client";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/app/context";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/datatable";
import { columns } from "./columns";
import { useGetRecent, useSearchFood } from "./search.service";

export default function Search() {
  const [searchParam, setSearchParam] = useState<string | null>(null);
  const user = useUserContext();
  const { data } = useGetRecent();

  const { data: searchData, refetch } = useSearchFood({ searchParam });
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <h1 className="text-xl">Log food</h1>
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
        onClick={() => {
          if (searchParam) {
            refetch();
          }
        }}
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
