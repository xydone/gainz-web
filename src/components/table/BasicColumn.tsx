"use client";

import { ColumnDef } from "@tanstack/react-table";

import { MealCateogies, Nutrients } from "@/app/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { AddDialog } from "./AddMenu";
import { ManageMenu } from "./ManageMenu";
import { Servings } from "@/app/types";
export type Food = {
  id: number;
  food_name: string;
  brand_name: string;
  nutrients: Nutrients;
  servings: Servings[];
};

export type Entry = {
  id: number;
  food_id: number;
  serving_id: number; 
  user_id: number;
  food: Food;
  created_at: number;
  category: MealCateogies;
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
): ColumnDef<Entry>["cell"] => {
  return ({ row }) => {
    const originalValue = row.original.food.nutrients[accessorKey];
    const roundedValue = roundDown(originalValue, decimals);
    return isNaN(roundedValue) ? "-" : roundedValue.toFixed(decimals);
  };
};

export const NameColumns = <T,>(): ColumnDef<T>[] => {
  return [
    {
      accessorKey: "food.food_name",
      header: "Food name",
      size: 100,
    },
    {
      accessorKey: "food.brand_name",
      header: "Brand name",
      size: 100,
    },
  ];
};

export const ImportantNutrients = <T,>(): ColumnDef<T>[] =>
  [
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

export const AddItems: ColumnDef<Entry> = {
  id: "additems",
  cell: ({ row }) => {
    return <AddDialog entry={row.original} />;
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

export const FoodAmount: ColumnDef<Entry> = {
  accessorKey: "amount",
  header: "Amount",
  cell: ({ row }) => {
    return row.original.amount;
  },
  size: 100,
};

export const DetailedNutrients: ColumnDef<Entry>[] = [
  {
    accessorKey: "macronutrients.sat_fat",
    header: "Saturated Fat",
    cell: createRoundedCell("sat_fat", 1),
  },
  {
    accessorKey: "macronutrients.polyunsat_fat",
    header: "Polyunsaturated Fat",
    cell: createRoundedCell("polyunsat_fat", 1),
  },
  {
    accessorKey: "macronutrients.monounsat_fat",
    header: "Monounsaturated Fat",
    cell: createRoundedCell("monounsat_fat", 1),
  },
  {
    accessorKey: "macronutrients.trans_fat",
    header: "Trans Fat",
    cell: createRoundedCell("trans_fat", 1),
  },
  {
    accessorKey: "macronutrients.cholesterol",
    header: "Cholesterol",
    cell: createRoundedCell("cholesterol", 0),
  },
  {
    accessorKey: "macronutrients.sodium",
    header: "Sodium",
    cell: createRoundedCell("sodium", 0),
  },
  {
    accessorKey: "macronutrients.potassium",
    header: "Potassium",
    cell: createRoundedCell("potassium", 0),
  },

  {
    accessorKey: "macronutrients.fiber",
    header: "Fiber",
    cell: createRoundedCell("fiber", 1),
  },
  {
    accessorKey: "macronutrients.sugar",
    header: "Sugar",
    cell: createRoundedCell("sugar", 1),
  },
  {
    accessorKey: "macronutrients.vitamin_a",
    header: "Vitamin A",
    cell: createRoundedCell("vitamin_a", 0),
  },
  {
    accessorKey: "macronutrients.vitamin_c",
    header: "Vitamin C",
    cell: createRoundedCell("vitamin_c", 0),
  },
  {
    accessorKey: "macronutrients.calcium",
    header: "Calcium",
    cell: createRoundedCell("calcium", 0),
  },
  {
    accessorKey: "macronutrients.iron",
    header: "Iron",
    cell: createRoundedCell("iron", 1),
  },
  {
    accessorKey: "macronutrients.added_sugars",
    header: "Added Sugars",
    cell: createRoundedCell("added_sugars", 1),
  },
  {
    accessorKey: "macronutrients.vitamin_d",
    header: "Vitamin D",
    cell: createRoundedCell("vitamin_d", 0),
  },
  {
    accessorKey: "macronutrients.sugar_alcohols",
    header: "Sugar Alcohols",
    cell: createRoundedCell("sugar_alcohols", 1),
  },
];
