import type { DragEndEvent } from "@dnd-kit/core";
import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import type { SortingStrategy } from "@dnd-kit/sortable";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";

interface SortableListProps<T extends { id: string | number }> {
	items: T[];
	onChange(items: T[]): void;
	renderItem(item: T): React.ReactNode;
	listClassName?: string;
	sortingStrategy?: SortingStrategy;
	disabled?: boolean;
}

export function SortableList<T extends { id: string | number }>({
	items,
	onChange,
	renderItem,
	listClassName,
	sortingStrategy = verticalListSortingStrategy,
	disabled = true,
}: SortableListProps<T>) {
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over.id);
			onChange(arrayMove(items, oldIndex, newIndex));
		}
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={items.map((item) => item.id)}
				strategy={sortingStrategy}
				disabled={disabled}
			>
				<div className={listClassName}>
					{items.map((item) => (
						<SortableItem key={item.id} id={item.id}>
							{renderItem(item)}
						</SortableItem>
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
}
