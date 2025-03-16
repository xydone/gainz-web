import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { dropdownColumns } from "./dropdowncolumns";
import { DataTable } from "../ui/datatable";
export const ViewDetails = ({ data }: { data: any[] }) => {
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  return (
    <Dialog open={isDetailsOpen} onOpenChange={setDetailsOpen}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>View details</DialogTitle>
          <DataTable columns={dropdownColumns} data={data} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
