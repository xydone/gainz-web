import { AddItems, BasicColumns, Food } from "@/components/table/BasicColumn";

export const columns = [...BasicColumns<Food>(), AddItems];
