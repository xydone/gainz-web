import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/datatable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState, Dispatch, SetStateAction } from "react";

import { ColumnDef } from "@tanstack/react-table";

interface IDialog {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  onClick: () => void;
}

interface DropdownMenuListProps {
  dialogs: IDialog[];
}

export default function TableDialog({
  columns,
  data,
  dialogs,
}: {
  columns: ColumnDef<any>[];
  data: any;
  dialogs?: IDialog[];
}) {
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const handleDetailsOpen = () => {
    setDetailsOpen(true);
  };
  return (
    <>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleDetailsOpen}>
              Expand details
            </DropdownMenuItem>
            {dialogs !== undefined && <DropdownMenuList dialogs={dialogs} />}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Dialog open={isDetailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>View details</DialogTitle>
            <DataTable columns={columns} data={data} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {dialogs !== undefined &&
        dialogs.map((dia) => {
          <Dialog open={dia.isOpen} onOpenChange={dia.setOpen}>
            <DialogContent className="max-w-6xl">
              <DialogHeader>
                <DialogTitle>{dia.title}</DialogTitle>
                <DataTable columns={columns} data={data} />
              </DialogHeader>
            </DialogContent>
          </Dialog>;
        })}
    </>
  );
}

const DropdownMenuList: React.FC<DropdownMenuListProps> = ({ dialogs }) => {
  return (
    <div>
      <DropdownMenuSeparator />
      {dialogs.map((dia, index) => (
        <DropdownMenuItem
          key={index}
          onClick={async () => {
            await dia.onClick();
            dia.setOpen(true);
          }}
        >
          {dia.title} {/* Display the title as the menu item label */}
        </DropdownMenuItem>
      ))}
    </div>
  );
};
