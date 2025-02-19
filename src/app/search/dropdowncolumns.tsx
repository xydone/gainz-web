"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Nutrients } from "../types";
export type Food = {
  food_name: string;
  brand_name: string;
  macronutrients: Nutrients;
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

export const dropdownColumns: ColumnDef<Food>[] = [
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
    accessorKey: "macronutrients.fat",
    header: "Fat",
    cell: createRoundedCell("fat", 1),
  },
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
    accessorKey: "macronutrients.carbs",
    header: "Carbs",
    cell: createRoundedCell("carbs", 1),
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
    accessorKey: "macronutrients.protein",
    header: "Protein",
    cell: createRoundedCell("protein", 1),
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
