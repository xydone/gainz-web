import {
  Food,
  ImportantNutrients,
  NameColumns,
} from "@/components/table/BasicColumn";

export const columns = [...NameColumns<Food>(), ...ImportantNutrients<Food>()];
