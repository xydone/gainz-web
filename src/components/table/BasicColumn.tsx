"use client";

import { ColumnDef } from "@tanstack/react-table";

import { MealCateogies, Nutrients } from "@/app/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { AddDialog } from "./AddMenu";
import { ManageMenu } from "./ManageMenu";

export type Food = {
  id: number;
  food_name: string;
  brand_name: string;
  nutrients: Nutrients;
  servings: [
    {
      id: number;
      amount: number;
      unit: string;
      multiplier: number;
    }
  ];
};
export type Entry = {
  entry_id: number;
  food_id: number;
  serving_id: number;
  created_at: number;
  category: MealCateogies;
  food_name: string;
  brand_name: string;
  amount: number;
  nutrients: Nutrients;
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

const createRoundedCell = <T extends keyof Food["nutrients"]>(
  accessorKey: T,
  decimals: number = 0
): ColumnDef<Food>["cell"] => {
  return ({ row }) => {
    const originalValue = row.original.nutrients[accessorKey];
    const roundedValue = roundDown(originalValue, decimals);
    return isNaN(roundedValue) ? "-" : roundedValue.toFixed(decimals);
  };
};

export const BasicColumns = <T,>(): ColumnDef<T>[] => {
  return [
    {
      accessorKey: "food_name",
      header: "Food name",
      size: 100,
    },
    {
      accessorKey: "brand_name",
      header: "Brand name",
      size: 100,
    },
    {
      accessorKey: "macronutrients.calories",
      header: "Calories",
      cell: createRoundedCell("calories", 0),
      size: 100,
    },
    {
      accessorKey: "macronutrients.carbs",
      header: "Carbs",
      cell: createRoundedCell("carbs", 1),
      size: 100,
    },
    {
      accessorKey: "macronutrients.fat",
      header: "Fat",
      cell: createRoundedCell("fat", 1),
      size: 100,
    },
    {
      accessorKey: "macronutrients.protein",
      header: "Protein",
      cell: createRoundedCell("protein", 1),
      size: 100,
    },
  ] as ColumnDef<T>[];
};

export const AddItems: ColumnDef<Food> = {
  id: "additems",
  cell: ({ row }) => {
    return <AddDialog food={row.original} />;
  },
  size: 50,
};

export const ManageItems = ({
  handleDeleted,
  handleEdited,
}: {
  handleDeleted: () => void;
  handleEdited: () => void;
}): ColumnDef<Entry> => {
  return {
    id: "manageitems",
    cell: ({ row }) => {
      return (
        <ManageMenu
          entry={row.original}
          handleDeleted={handleDeleted}
          handleEdited={handleEdited}
        />
      );
    },
    size: 50,
  };
};

export const CreatedAt: ColumnDef<Entry> = {
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
  size: 100,
};
