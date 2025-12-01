"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";
import { cn } from "@/lib/utils";

const CenteredProgress = React.forwardRef<
	React.ElementRef<typeof ProgressPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value = 0, max = 100, ...props }, ref) => {
	const isNegative = (value || 0) < 0;

	const absoluteValue = Math.abs(value || 0);
	const percentage = (absoluteValue / (max || 100)) * 100;

	const width = percentage / 2;

	return (
		<ProgressPrimitive.Root
			ref={ref}
			max={max}
			className={cn(
				"relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
				className,
			)}
			{...props}
		>
			<div className="absolute left-1/2 top-0 h-full w-[1px] bg-background/50 z-10 -translate-x-1/2" />

			<ProgressPrimitive.Indicator
				className={cn(
					"absolute top-0 h-full transition-all duration-300 ease-in-out",
					isNegative ? "bg-red-500" : "bg-green-500",
				)}
				style={{
					left: "50%",
					width: `${width}%`,
					transform: isNegative ? "translateX(-100%)" : "translateX(0%)",
				}}
			/>
		</ProgressPrimitive.Root>
	);
});
CenteredProgress.displayName = ProgressPrimitive.Root.displayName;

export { CenteredProgress };
