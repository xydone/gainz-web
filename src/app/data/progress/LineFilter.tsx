import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Dispatch, SetStateAction } from "react";

export default function LineFilter({
  maxLines,
  lines,
  setLines,
  map,
}: {
  maxLines: string[];
  lines: string[];
  setLines: Dispatch<SetStateAction<string[]>>;
  map: {
    [key: string]: string;
  };
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="absolute top-5 right-5 text-muted">
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Display lines</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 ">
          {maxLines.map((line, i) => {
            return (
              <div key={i} className="flex gap-3 items-center">
                <Checkbox
                  value={line}
                  checked={(() => {
                    if (lines && lines.some((element) => element === line)) {
                      return true;
                    }
                    return false;
                  })()}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setLines((prevLines) =>
                        prevLines ? [...prevLines, line] : [line]
                      );
                    } else {
                      setLines(
                        (prevLines) =>
                          prevLines?.filter((element) => element !== line) ||
                          null
                      );
                    }
                  }}
                />
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: `var(--${line})`,
                  }}
                />
                <label>{map[line]}</label>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
