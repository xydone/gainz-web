import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import type { FormSchema } from "./page";

export default function Labels({
	form,
	className,
}: {
	form: UseFormReturn<z.infer<typeof FormSchema>>;
	className?: string;
}) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Collapsible
			className={cn("w-1/2 mt-5", className)}
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<Card>
				<CollapsibleTrigger className="flex flex-col space-y-1.5 text-left w-full">
					<CardHeader>
						<CardTitle>Labels</CardTitle>
						<CardDescription>
							{isOpen === false
								? "~very important, click to expand~"
								: "~click to collapse~"}
						</CardDescription>
					</CardHeader>
				</CollapsibleTrigger>
				<CollapsibleContent
					forceMount={true}
					className="data-[state=closed]:hidden"
				>
					<CardContent className="grid gap-5">
						<FormField
							control={form.control}
							name={"brand_name"}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Brand name</FormLabel>
									<FormControl>
										<Input onChange={field.onChange} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name={"food_name"}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Food name</FormLabel>
									<FormControl>
										<Input onChange={field.onChange} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name={"food_grams"}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Food grams</FormLabel>
									<FormControl>
										<Input onChange={field.onChange} />
									</FormControl>

									<FormMessage />
									<FormDescription>
										This field represents the amount of grams you are using to
										set the macronutrients.
									</FormDescription>
									<FormDescription>
										(e.g. 200 calories per <u>100g</u>)
									</FormDescription>
								</FormItem>
							)}
						/>
					</CardContent>
				</CollapsibleContent>
			</Card>
		</Collapsible>
	);
}
