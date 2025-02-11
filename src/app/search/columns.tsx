"use client";

import { ColumnDef } from "@tanstack/react-table";

import CustomDialog from "./CustomDialog";

export type Food = {
  id: number;
  food_name: string;
  brand_name: string;
  macronutrients: {
    calories: number;
    fat: number;
    sat_fat: number;
    polyunsat_fat: number;
    monounsat_fat: number;
    trans_fat: number;
    cholesterol: number;
    sodium: number;
    potassium: number;
    carbs: number;
    fiber: number;
    sugar: number;
    protein: number;
    vitamin_a: number;
    vitamin_c: number;
    calcium: number;
    iron: number;
    added_sugars: number;
    vitamin_d: number;
    sugar_alcohols: number;
  };
  servings: [
    {
      id: number;
      amount: number;
      unit: string;
      multiplier: number;
    }
  ];
};

const roundDown = (num: number | undefined, decimals: number = 0): number => {
  if (typeof num !== "number" || num === undefined) return NaN;
  const factor = Math.pow(10, decimals);
  return Math.floor(num * factor) / factor;
};

const createRoundedCell = <T extends keyof Food["macronutrients"]>(
  accessorKey: T,
  decimals: number = 0
): ColumnDef<Food>["cell"] => {
  return ({ row }) => {
    const originalValue = row.original.macronutrients[accessorKey];
    const roundedValue = roundDown(originalValue, decimals);
    return isNaN(roundedValue) ? "-" : roundedValue.toFixed(decimals);
  };
};

export const columns: ColumnDef<Food>[] = [
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
      return <CustomDialog food={row.original} />;
    },
  },
];
