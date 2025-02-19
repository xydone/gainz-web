"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";

import { dropdownColumns } from "../search/dropdowncolumns";
import TableDialog from "@/components/ui/TableDialog";
import { Nutrients } from "../types";

export type Entry = {
  created_at: number;
  food_name: string;
  brand_name: string;
  macronutrients: Nutrients;
};

const formatDateFromTimestamp = (timestamp: number | undefined): string => {
  if (!timestamp) return "-";

  try {
    const date = new Date(timestamp / 1000);
    return format(date, "dd-MM-yyyy HH:mm:ss");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

const roundDown = (num: number | undefined, decimals: number = 0): number => {
  if (typeof num !== "number" || num === undefined) return NaN;
  const factor = Math.pow(10, decimals);
  return Math.floor(num * factor) / factor;
};

const createRoundedCell = <T extends keyof Entry["macronutrients"]>(
  accessorKey: T,
  decimals: number = 0
): ColumnDef<Entry>["cell"] => {
  return ({ row }) => {
    const originalValue = row.original.macronutrients[accessorKey];
    const roundedValue = roundDown(originalValue, decimals);
    return isNaN(roundedValue) ? "-" : roundedValue.toFixed(decimals);
  };
};

export const columns: ColumnDef<Entry>[] = [
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const timestamp = row.original.created_at;
      return formatDateFromTimestamp(timestamp);
    },
    sortingFn: (rowA, rowB) => {
      const timestampA = rowA.original.created_at || 0;
      const timestampB = rowB.original.created_at || 0;

      return timestampA - timestampB;
    },
  },
  {
    accessorKey: "food_name",
    header: "Food name",
  },
  {
    accessorKey: "brand_name",
    header: "Brand name",
  },
  {
    accessorKey: "macronutrients.calories",
    header: "Calories",
    cell: createRoundedCell("calories", 0),
  },
  {
    accessorKey: "macronutrients.carbs",
    header: "Carbs",
    cell: createRoundedCell("carbs", 1),
  },
  {
    accessorKey: "macronutrients.fat",
    header: "Fat",
    cell: createRoundedCell("fat", 1),
  },
  {
    accessorKey: "macronutrients.protein",
    header: "Protein",
    cell: createRoundedCell("protein", 1),
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return <TableDialog columns={dropdownColumns} data={[row.original]} />;
    },
  },
];
