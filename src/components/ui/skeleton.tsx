import { cn } from "@/lib/utils";

function Skeleton({
	className,
	notRounded = true,
	...props
}: React.HTMLAttributes<HTMLDivElement> & { notRounded?: boolean }) {
	return (
		<div
			className={cn(
				"animate-pulse bg-accent",
				!notRounded && "rounded-md",
				className,
			)}
			{...props}
		/>
	);
}

export { Skeleton };
