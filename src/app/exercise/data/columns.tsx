"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ExerciseEntry } from "./entry.service";

export const columns: ColumnDef<ExerciseEntry>[] = [
  {
    accessorKey: "exercise_name",
    header: "Exercise name",
  },
  {
    accessorKey: "value",
    header: "Amount",
  },
  {
    accessorKey: "unit_amount",
    header: "Unit amount",
  },
  {
    accessorKey: "unit_name",
    header: "Unit name",
  },
  {
    accessorKey: "category_name",
    header: "Category name",
  },
];
