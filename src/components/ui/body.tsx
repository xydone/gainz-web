import { cn } from "@/lib/utils";
import { FrontBodyParts, FrontBodyPart } from "./body-part";

type Props = {
  className?: string;
  styles: Record<FrontBodyPart, string>;
};

export const FrontBody = ({ className, styles }: Props) => {
  return (
    <svg
      viewBox="0 0 660.46 1206.46"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("max-w-sm mx-auto", className)}
    >
      {Object.entries(FrontBodyParts).map(([partId, partPaths]) => (
        <g key={partId} id={partId} color={styles[partId as FrontBodyPart]}>
          {partPaths}
        </g>
      ))}
    </svg>
  );
};
