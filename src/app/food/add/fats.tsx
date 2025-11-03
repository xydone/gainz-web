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

export default function Fats({
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
				<CardHeader>
					<CollapsibleTrigger className="flex flex-col space-y-1.5 text-left">
						<CardTitle>Fats</CardTitle>
						<CardDescription>
							~click to {isOpen === false ? "expand" : "collapse"}~
						</CardDescription>
					</CollapsibleTrigger>
				</CardHeader>
				<CollapsibleContent
					forceMount={true}
					className="data-[state=closed]:hidden"
				>
					<CardContent className="grid gap-5">
						<FormField
							control={form.control}
							name={"sat_fat"}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Saturated Fats</FormLabel>
									<FormControl>
										<Input onChange={field.onChange} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name={"polyunsat_fat"}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Polyunsaturated Fats</FormLabel>
									<FormControl>
										<Input onChange={field.onChange} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name={"monounsat_fat"}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Monounsaturated Fats</FormLabel>
									<FormControl>
										<Input onChange={field.onChange} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name={"trans_fat"}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Trans Fats</FormLabel>
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
