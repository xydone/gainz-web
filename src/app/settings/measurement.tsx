"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import {
	SetMeasurementSchema,
	setMeasurement,
} from "@/app/data/progress/progress.service";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn, formatDateString } from "@/lib/utils";

export default function MeasurementCard() {
	return (
		<Card className={cn("relative")}>
			<CardHeader>
				<CardTitle>Log measurement</CardTitle>
			</CardHeader>
			<CardContent>
				<MeasurementContent />
			</CardContent>
		</Card>
	);
}

export function MeasurementContent() {
	const form = useForm<z.infer<typeof SetMeasurementSchema>>({
		resolver: zodResolver(SetMeasurementSchema),
	});

	const onSubmit = async (data: z.infer<typeof SetMeasurementSchema>) => {
		try {
			await setMeasurement(data);
			toast.success("Measurement created successfully!");
		} catch {
			toast.error("Failed to create measurement. Please try again.");
		}
	};
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-5"
			>
				<FormField
					control={form.control}
					name="type"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Measurement Type</FormLabel>
							<Select onValueChange={field.onChange}>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
								</FormControl>
								<SelectContent className="bg-background">
									<SelectItem value="weight">Weight</SelectItem>
									<SelectItem value="waist">Waist</SelectItem>
									<SelectItem value="hips">Hips</SelectItem>
									<SelectItem value="neck">Neck</SelectItem>
								</SelectContent>
							</Select>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="value"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Value</FormLabel>
							<FormControl>
								<Input
									className=""
									placeholder="Value"
									onChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="date"
					// defaultValue={new Date()}
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Measurement date</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={"outline"}
											className={cn(
												"pl-3 text-left font-normal",
												!field.value && "text-muted-foreground",
											)}
										>
											{field.value ? (
												format(field.value, "PPP")
											) : (
												<span>Pick a date</span>
											)}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="m-10" align="start">
									<Calendar
										mode="single"
										selected={field.value ? new Date(field.value) : undefined}
										onSelect={(date) =>
											field.onChange(date ? formatDateString(date) : null)
										}
										disabled={(date) => date > new Date()}
									/>
								</PopoverContent>
							</Popover>
						</FormItem>
					)}
				/>
				<Button
					variant="outline"
					className="active:bg-accent-strong"
					type="submit"
				>
					Submit
				</Button>
			</form>
		</Form>
	);
}
