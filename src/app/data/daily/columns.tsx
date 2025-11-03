import {
	type Entry,
	FoodAmount,
	ImportantNutrients,
	ManageItems,
	NameColumns,
} from "@/components/table/BasicColumn";
import type { ColumnDef } from "@tanstack/react-table";

export const Column = ({
	handleDeleted,
	handleEdited,
}: {
	handleDeleted: () => void;
	handleEdited: () => void;
}): ColumnDef<Entry>[] => {
	return [
		...NameColumns<Entry>(),
		FoodAmount,
		...ImportantNutrients<Entry>(),
		ManageItems({ handleDeleted, handleEdited }),
	];
};
