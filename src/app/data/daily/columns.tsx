import {
  ManageItems,
  Entry,
  FoodAmount,
  NameColumns,
  ImportantNutrients,
} from "@/components/table/BasicColumn";
import { ColumnDef } from "@tanstack/react-table";

export const Column = ({
  handleDeleted,
  handleEdited,
}: {
  handleDeleted: () => void;
  handleEdited: () => void;
}): ColumnDef<Entry>[] => {
  return [
    ...NameColumns<Entry>(),
    FoodAmount,
    ...ImportantNutrients<Entry>(),
    ManageItems({ handleDeleted, handleEdited }),
  ];
};
