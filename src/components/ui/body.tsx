import { cn } from "@/lib/utils";
import { type FrontBodyPart, FrontBodyParts } from "./body-part";

type Props = {
	className?: string;
	styles: Record<FrontBodyPart, string>;
};

export const FrontBody = ({ className, styles }: Props) => {
	return (
		<svg
			role="img"
			aria-labelledby="front-body-title"
			xmlns="http://www.w3.org/2000/svg"
			className={cn("max-w-sm mx-auto", className)}
		>
			<title id="front-body-title">Front body parts</title>
			{Object.entries(FrontBodyParts).map(([partId, partPaths]) => (
				<g key={partId} id={partId} color={styles[partId as FrontBodyPart]}>
					{partPaths}
				</g>
			))}
		</svg>
	);
};
