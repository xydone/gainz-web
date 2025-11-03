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

export default function Others({
	form,
	className,
}: {
	form: UseFormReturn<z.infer<typeof FormSchema>>;
	className?: string;
}) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Collapsible
			className={cn("w-1/2 mt-5 place-self-center", className)}
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<Card>
				<CollapsibleTrigger className="flex flex-col space-y-1.5 text-left w-full">
					<CardHeader>
						<CardTitle>Others</CardTitle>
						<CardDescription>
							~click to {isOpen === false ? "expand" : "collapse"}~
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
							name={"cholesterol"}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Cholesterol</FormLabel>
									<FormControl>
										<Input onChange={field.onChange} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
				</CollapsibleContent>
			</Card>
		</Collapsible>
	);
}
