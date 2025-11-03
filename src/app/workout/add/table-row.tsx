import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import type React from "react";
import { v4 as uuidv4 } from "uuid";

interface Exercise {
	id: string;
	exercise_id: string;
	notes: string;
	sets: number;
	reps: number;
}
interface Response {
	id: number;
	name: string;
	description: string;
}
interface SortableTableRowProps {
	exercises: Response[];
	item: Exercise;
	handleInputChange: (
		id: string | number,
		field: "exercise_id" | "notes" | "sets" | "reps",
		value: string,
	) => void;
	handleDeleteItem: (id: string) => void;
}

export const SortableTableRow: React.FC<SortableTableRowProps> = ({
	item,
	exercises,
	handleInputChange,
	handleDeleteItem,
}) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: item.exercise_id });

	return (
		<TableRow
			ref={setNodeRef}
			style={{
				transform: CSS.Transform.toString(transform),
				transition,
			}}
			className={cn(
				"relative transition-all",
				isDragging ? "opacity-50 z-10" : "opacity-100 z-auto",
			)}
		>
			<TableCell>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					{...attributes}
					{...listeners}
					className="cursor-grab"
				>
					<GripVertical className="h-4 w-4" />
				</Button>
			</TableCell>
			<TableCell>
				<Select
					value={item.exercise_id?.toString()}
					onValueChange={(value) =>
						handleInputChange(item.id, "exercise_id", value)
					}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select an exercise" />
					</SelectTrigger>
					<SelectContent>
						{exercises?.map((element: Response) => (
							<SelectItem value={`${element.id}`} key={uuidv4()}>
								{element.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</TableCell>
			<TableCell>
				<Input
					type="number"
					value={item.sets}
					onChange={(e) => handleInputChange(item.id, "sets", e.target.value)}
				/>
			</TableCell>
			<TableCell>
				<Input
					type="number"
					value={item.reps}
					onChange={(e) => handleInputChange(item.id, "reps", e.target.value)}
				/>
			</TableCell>
			<TableCell>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => handleDeleteItem(item.id)}
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			</TableCell>
		</TableRow>
	);
};
