"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";

import { useUserContext } from "@/app/context";
import { axiosInstance } from "@/lib/api";
import Carbs from "./carbs";
import Fats from "./fats";
import Labels from "./labels";
import Macronutrients from "./macronutrients";
import Minerals from "./minerals";
import Others from "./others";
import Vitamins from "./vitamins";

export const FormSchema = z
	.object({
		brand_name: z.string().optional(),
		food_name: z.string().optional(),
		food_grams: z.coerce.number({
			message: "Must be a number and cannot be empty!",
		}),
		calories: z.coerce.number({
			message: "Must be a number and cannot be empty!",
		}),
		fat: z.coerce.number().optional(),
		sat_fat: z.coerce.number().optional(),
		polyunsat_fat: z.coerce.number().optional(),
		monounsat_fat: z.coerce.number().optional(),
		trans_fat: z.coerce.number().optional(),
		cholesterol: z.coerce.number().optional(),
		sodium: z.coerce.number().optional(),
		potassium: z.coerce.number().optional(),
		carbs: z.coerce.number().optional(),
		fiber: z.coerce.number().optional(),
		sugar: z.coerce.number().optional(),
		protein: z.coerce.number().optional(),
		vitamin_a: z.coerce.number().optional(),
		vitamin_c: z.coerce.number().optional(),
		calcium: z.coerce.number().optional(),
		iron: z.coerce.number().optional(),
		added_sugars: z.coerce.number().optional(),
		vitamin_d: z.coerce.number().optional(),
		sugar_alcohols: z.coerce.number().optional(),
	})
	.refine(
		(data) => data.brand_name !== undefined || data.food_name !== undefined,
		{
			message: "At least one of brand name or food name must be present.",
			path: ["brand_name"],
		},
	);

export default function Create() {
	const user = useUserContext();
	// const [isAPIOkay, setApiOkay] = useState<boolean | null>(null);
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		const { brand_name, food_name, food_grams, ...nutrients } = data;
		try {
			await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/food`, {
				brand_name,
				food_name,
				food_grams,
				nutrients: nutrients,
			});

			toast.success("Food created successfully!");
		} catch {
			toast.error("Failed to create food. Please try again.");
		}
	}

	return (
		<div>
			<h1 className="text-xl text-center">Add new food</h1>
			<div className="flex justify-center ">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col w-3/5"
					>
						<div className="flex flex-col lg:flex-row items-center lg:space-x-5">
							<Labels form={form} className="min-w-44" />
							<Macronutrients form={form} className="min-w-44" />
							<Fats form={form} className="min-w-44" />
						</div>
						<div className="flex flex-col lg:flex-row items-center lg:space-x-5">
							<Carbs form={form} className="min-w-44" />
							<Minerals form={form} className="min-w-44" />
							<Vitamins form={form} className="min-w-44" />
						</div>
						<Others form={form} className="min-w-44" />
						<Button
							type="submit"
							variant={"outline"}
							className={"mt-3 place-self-center"}
							disabled={!user.isSignedIn}
						>
							Submit
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
