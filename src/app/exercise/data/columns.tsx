"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@radix-ui/react-dialog";
import type { ColumnDef } from "@tanstack/react-table";
import { type Dispatch, type SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TableDialog from "@/components/table/TableDialog";
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	type ExerciseEntry,
	useDeleteExerciseEntry,
	useEditExerciseEntry,
	useGetExerciseUnits,
} from "./entry.service";
export const Columns = ({
	handleDeleted,
	handleEdited,
}: {
	handleDeleted: () => void;
	handleEdited: () => void;
}): ColumnDef<ExerciseEntry>[] => {
	return [
		{
			accessorKey: "exercise_name",
			header: "Exercise name",
		},
		{
			accessorKey: "value",
			header: "Amount",
		},
		{
			accessorKey: "unit_amount",
			header: "Unit amount",
		},
		{
			accessorKey: "unit_name",
			header: "Unit name",
		},
		{
			accessorKey: "category_name",
			header: "Category name",
		},
		ManageItems({ handleDeleted, handleEdited }),
	];
};

export const ManageItems = ({
	handleDeleted,
	handleEdited,
}: {
	handleDeleted: () => void;
	handleEdited: () => void;
}): ColumnDef<ExerciseEntry> => {
	return {
		id: "manageitems",
		cell: ({ row }) => {
			return (
				<ManageMenu
					entry={row.original}
					handleDeleted={handleDeleted}
					handleEdited={handleEdited}
				/>
			);
		},
		size: 50,
	};
};

function ManageMenu({
	entry,
	handleDeleted,
	handleEdited,
}: {
	entry: ExerciseEntry;
	handleDeleted: () => void;
	handleEdited: () => void;
}) {
	const [isEditOpen, setEditOpen] = useState(false);
	const [isDeleteOpen, setDeleteOpen] = useState(false);

	const { mutate: deleteMutate } = useDeleteExerciseEntry({
		id: entry.entry_id,
		callback: () => {
			setDeleteOpen(false);
			handleDeleted();
		},
	});

	return (
		<div>
			<div>
				<TableDialog
					columns={Columns({ handleDeleted, handleEdited })}
					data={[entry]}
					dialogs={[
						{
							title: "Edit entry",
							isOpen: isEditOpen,
							setOpen: setEditOpen,
							onClick: () => {},
						},
						{
							title: "Delete entry",
							isOpen: isDeleteOpen,
							setOpen: setDeleteOpen,
							onClick: () => {},
						},
					]}
				/>
			</div>
			{isEditOpen && (
				<EditDialog
					entry={entry}
					handleEdited={handleEdited}
					isEditOpen={isEditOpen}
					setEditOpen={setEditOpen}
				/>
			)}
			<DeleteDialog
				isDeleteOpen={isDeleteOpen}
				setDeleteOpen={setDeleteOpen}
				entry={entry}
				deleteMutate={deleteMutate}
			/>
		</div>
	);
}

function EditDialog({
	entry,
	handleEdited,
	isEditOpen,
	setEditOpen,
}: {
	entry: ExerciseEntry;
	handleEdited: () => void;
	isEditOpen: boolean;
	setEditOpen: Dispatch<SetStateAction<boolean>>;
}) {
	const FormSchema = z.object({
		exercise_id: z.coerce.number(),
		value: z.coerce.number(),
		unit_id: z.coerce.number(),
		notes: z.string().nullable(),
	});

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			exercise_id: entry.exercise_id,
			value: entry.value,
			unit_id: entry.unit_id,
			notes: entry.notes,
		},
	});

	const formValues = form.watch();
	const { mutate } = useEditExerciseEntry({
		entry_id: entry.entry_id,
		exercise_id: formValues.exercise_id,
		value: formValues.value,
		unit_id: formValues.unit_id,
		notes: formValues.notes,
		callback: () => {
			handleEdited();
			setEditOpen(false);
		},
	});

	const { data: unitData } = useGetExerciseUnits();

	const onSubmit = async () => {
		mutate();
	};

	return (
		<Dialog open={isEditOpen} onOpenChange={setEditOpen}>
			<DialogContent className="max-w-xl w-5/6">
				<DialogHeader>
					<DialogTitle>Edit your entry for {entry.exercise_name}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-5"
					>
						<div className="flex gap-5 flex-col sm:flex-row">
							<FormField
								control={form.control}
								name="value"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Value</FormLabel>
										<FormControl>
											<Input
												type="number"
												className=""
												placeholder="Value"
												onChange={field.onChange}
												value={field.value}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="unit_id"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Unit</FormLabel>
										<Select
											value={`${field.value}`}
											onValueChange={field.onChange}
										>
											<FormControl>
												<SelectTrigger className="w-[100%] sm:max-w-36 sm:w-36">
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent className="bg-popover">
												{unitData?.map((unit) => (
													<SelectItem key={unit.id} value={`${unit.id}`}>
														{unit.amount} {unit.unit}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="notes"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Notes</FormLabel>
										<FormControl>
											<Input
												className=""
												placeholder="(optional)"
												value={field.value ?? ""}
												onChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<Button
							variant="outline"
							className="active:bg-accent-strong"
							type="submit"
						>
							Edit
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
function DeleteDialog({
	isDeleteOpen,
	setDeleteOpen,
	entry,
	deleteMutate,
}: {
	isDeleteOpen: boolean;
	setDeleteOpen: Dispatch<SetStateAction<boolean>>;
	entry: ExerciseEntry;
	deleteMutate: () => void;
}) {
	return (
		<Dialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
			<DialogContent className="max-w-xl w-5/6">
				<DialogHeader>
					<DialogTitle>Delete your entry for {entry.exercise_name}</DialogTitle>
				</DialogHeader>
				<Button
					variant="destructive"
					onClick={() => {
						deleteMutate();
					}}
				>
					Delete
				</Button>
			</DialogContent>
		</Dialog>
	);
}
