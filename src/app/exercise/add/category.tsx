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

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { postCategory } from "./add-exercise.service";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useUserContext } from "@/app/context";

export const FormSchema = z.object({
	name: z.string().nonempty(),
	description: z.string().optional(),
});

export default function Category({ className }: { className?: string }) {
	const user = useUserContext();
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	const onSubmit = (form: z.infer<typeof FormSchema>) => {
		try {
			postCategory(form);

			toast.success("Category created successfully!");
		} catch {
			toast.error("Failed to create category. Please try again.");
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={cn(className)}>
				<Card className="flex flex-col">
					<CardHeader>
						<CardTitle>{"Category"}</CardTitle>
						<CardDescription>Create a new category.</CardDescription>
						<CardDescription>(e.g. cardio, chest, bicep)</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-5">
						<FormField
							control={form.control}
							name={"name"}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input onChange={field.onChange} className="max-w-[95%]" />
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
										<Input
											onChange={field.onChange}
											placeholder="Optional"
											className="max-w-[95%]"
										/>
									</FormControl>

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
