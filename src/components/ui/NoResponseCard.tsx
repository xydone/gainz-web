import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
export default function NoResponse({
	className,
	title,
	description,
}: {
	className?: string;
	title: string;
	description: string;
}) {
	return (
		<Card className={cn("", className)}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
		</Card>
	);
}
