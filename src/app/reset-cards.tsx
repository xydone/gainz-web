import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
	onResetCard: () => void;
}
export function ResetCards({ onResetCard }: Props) {
	return (
		<Button variant="outline" className="m-2" onClick={onResetCard}>
			<RotateCcw />
		</Button>
	);
}
