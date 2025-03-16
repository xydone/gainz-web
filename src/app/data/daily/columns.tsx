import {
  ManageItems,
  BasicColumns,
  Entry,
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
    ...BasicColumns<Entry>(),
    ManageItems({ handleDeleted, handleEdited }),
  ];
};
