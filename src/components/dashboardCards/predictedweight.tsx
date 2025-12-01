import { addDays, format } from "date-fns";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useGetPredictedWeight } from "@/lib/services/user";
import { cn } from "@/lib/utils";
import { CenteredProgress } from "../ui/centeredprogress";
import NoResponse from "../ui/NoResponseCard";
import { Skeleton } from "../ui/skeleton";

//TODO: this currently doesnt like early predictions
//TODO: allow for customization on goals for gain and loss (make the progress bar max/bottom out at a user defined range)
export default function PredictedWeight({
	className,
	date,
}: {
	className?: string;
	date: Date;
}) {
	const tomorrow = addDays(date, 1);
	const { data, isLoading, error } = useGetPredictedWeight({ date: tomorrow });

	if (error && !isLoading) {
		return (
			<NoResponse
				title="Weight could not be predicted for this date"
				description="Check if you have trained a weight model"
			/>
		);
	}

	if (isLoading || !data) {
		return (
			<Card className={cn("", className)}>
				<CardHeader>
					<CardTitle>Predicted Weight</CardTitle>
				</CardHeader>
				<CardContent className="w-full flex items-center justify-center gap-3">
					<CardSkeleton />
				</CardContent>
			</Card>
		);
	}

	const scaledDelta = data.predicted_delta * 100;
	const value = Math.max(-100, Math.min(100, scaledDelta));
	return (
		<Card className={cn("", className)}>
			<CardHeader>
				<CardTitle>Tomorrow's Predicted Weight</CardTitle>
				<CardDescription>{`${format(tomorrow, "dd MMMM yyyy")}`}</CardDescription>
			</CardHeader>
			<CardContent className="w-full flex flex-col justify-center gap-3">
				<div className="w-full flex items-center justify-center gap-3">
					<span className="text-sm">Lose</span>
					<CenteredProgress
						value={value}
						className={"border border-foreground/10 "}
					/>
					<span className="text-sm">Gain</span>
				</div>

				<div className="text-center">
					<span className="text-sm">Your predicted weight for tomorrow is</span>
					<span
						className={`text-sm ${
							data.predicted_delta > 0 ? "text-green-500" : "text-red-500"
						}`}
					>
						{" "}
						{data.predicted_weight.toFixed(2)} (
						{data.predicted_delta.toFixed(2)})
					</span>
					<span>.</span>
				</div>
			</CardContent>
		</Card>
	);
}

export function CardSkeleton() {
	return (
		<div className="flex p-6 pt-0 absolute inset-0 z-10">
			<Skeleton className="w-full h-full" notRounded />
		</div>
	);
}
