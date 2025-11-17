import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { useUserContext } from "@/app/context";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { postExercise, useGetCategories } from "./add-exercise.service";
import {
	MultiSelect,
	MultiSelectContent,
	MultiSelectGroup,
	MultiSelectItem,
	MultiSelectTrigger,
	MultiSelectValue,
} from "@/components/ui/multi-select";
import { ExerciseUnit, useGetExerciseUnits } from "../data/entry.service";

interface Category {
	id: number;
	name: string;
	description?: string;
}

export const FormSchema = z.object({
	name: z.string().nonempty(),
	description: z.string().optional(),
	category_ids: z.array(z.coerce.number()),
	unit_ids: z.array(z.coerce.number()),
});

export default function Exercise({ className }: { className?: string }) {
	const user = useUserContext();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	const { data: categories } = useGetCategories();

	const { data: units } = useGetExerciseUnits();
	const onSubmit = async (data: z.infer<typeof FormSchema>) => {
		try {
			await postExercise(data);
			toast.success("Exercise created successfully!");
		} catch {
			toast.error("Failed to create exercise. Please try again.");
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={cn(className)}>
				<Card className="mt-5 flex flex-col">
					<CardHeader>
						<CardTitle>Exercise</CardTitle>
						<CardDescription>
							Create a new exercise without making a new category. The base unit
							is automatically created.
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-5">
						<FormField
							control={form.control}
							name={"name"}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input onChange={field.onChange} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name={"description"}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input onChange={field.onChange} placeholder="Optional" />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name={"unit_ids"}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Unit</FormLabel>
									<MultiSelect onValuesChange={field.onChange}>
										<FormControl>
											<MultiSelectTrigger className="w-full">
												<MultiSelectValue placeholder="Select a unit" />
											</MultiSelectTrigger>
										</FormControl>
										<MultiSelectContent>
											<MultiSelectGroup>
												{units?.map((element: ExerciseUnit) => (
													<MultiSelectItem
														value={`${element.id}`}
														key={element.id}
													>
														{element.amount} {element.unit}
													</MultiSelectItem>
												))}
											</MultiSelectGroup>
										</MultiSelectContent>
									</MultiSelect>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name={"category_ids"}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
									<MultiSelect onValuesChange={field.onChange}>
										<FormControl>
											<MultiSelectTrigger className="w-full">
												<MultiSelectValue placeholder="Select a category" />
											</MultiSelectTrigger>
										</FormControl>
										<MultiSelectContent>
											<MultiSelectGroup>
												{categories?.map((element: Category) => (
													<MultiSelectItem
														value={`${element.id}`}
														key={element.id}
													>
														{element.name}
													</MultiSelectItem>
												))}
											</MultiSelectGroup>
										</MultiSelectContent>
									</MultiSelect>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
					<Button
						type="submit"
						variant={"outline"}
						className={"mt-3 self-center mb-3"}
						disabled={!user.isSignedIn}
					>
						Submit
					</Button>
				</Card>
			</form>
		</Form>
	);
}
