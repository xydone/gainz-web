import { rectSortingStrategy } from "@dnd-kit/sortable";
import { subMonths } from "date-fns";
import { Settings, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import { SortableList } from "@/components/ui/SortableList";
import { cn } from "@/lib/utils";
import { AddCardPopover } from "./add-card";
import Weight from "./data/progress/weight";
import { GoalsCard } from "./goals";
import NutrientDistribution from "./nutrient-distribution";
import QuickAdd from "./quick-add";
import { ResetCards } from "./reset-cards";
import { NutrientKeys } from "./types";

interface Goal {
	value: number;
}
export interface Goals {
	protein: Goal | null;

	sugar: Goal | null;

	calories: Goal | null;
}

export interface GoalsResponse {
	id: number;
	target: string;
	value: number;
}
export type DashboardItem = {
	id: string;
	component: "GoalsCard" | "NutrientDistribution" | "QuickAdd" | "Weight";
	// biome-ignore lint: ease of use, cant be certain what we will need in the future. no real benefit in maintaining type safety here for now.
	props?: any;
};
const goalCards: DashboardItem[] = NutrientKeys.map((nutrient) => ({
	id: `goals-${nutrient}`,
	component: "GoalsCard",
	props: { goalName: nutrient },
}));
const allAvailableCards: DashboardItem[] = [
	...goalCards,
	{ id: "nutrient-distribution", component: "NutrientDistribution" },
	{ id: "quick-add", component: "QuickAdd" },
	{ id: "weight-chart", component: "Weight" },
];

const initialDashboardLayout: DashboardItem[] = [
	// cards that are initially added
	"goals-calories",
	"goals-protein",
	"goals-sugar",
	"nutrient-distribution",
	"quick-add",
	"weight-chart",
]
	.map((id) => allAvailableCards.find((item) => item.id === id))
	.filter((item): item is DashboardItem => Boolean(item));

const LOCAL_STORAGE_KEY = "dashboardLayout";

export default function SignedIn() {
	const [date, setDate] = useState<Date>(new Date());

	// load initial state from localStorage
	const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>(() => {
		const savedLayout = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (savedLayout) {
			// make sure ids are valid
			const parsedLayout: DashboardItem[] = JSON.parse(savedLayout);
			const validLayout = parsedLayout
				.map((item) =>
					allAvailableCards.find(
						(availableCard) => availableCard.id === item.id,
					),
				)
				.filter((item): item is DashboardItem => Boolean(item));
			return validLayout;
		}
		return initialDashboardLayout;
	});

	useEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dashboardItems));
	}, [dashboardItems]);
	const [isSortingDisabled, setIsSortingDisabled] = useState<boolean>(true);
	const renderDashboardItem = (item: DashboardItem) => {
		// The component to be rendered (GoalsCard, Weight, etc.)
		const componentToRender = () => {
			switch (item.component) {
				case "GoalsCard":
					return <GoalsCard {...item.props} date={date} />;
				case "NutrientDistribution":
					return <NutrientDistribution className="" date={date} />;
				case "QuickAdd":
					return <QuickAdd />;
				case "Weight":
					return (
						<Weight
							className=""
							startDate={subMonths(date, 3)}
							endDate={date}
						/>
					);
				default:
					return null;
			}
		};

		// Return a wrapper div that includes the delete button
		return (
			<div className="relative h-full w-full">
				{componentToRender()}
				{!isSortingDisabled && (
					<Button
						variant="ghost"
						size="icon"
						className="absolute top-2 right-2 h-6 w-6 rounded-full bg-background"
						// doing this to prevent being unable to click the button due to drag and drop
						onPointerDown={(e) => e.stopPropagation()}
						onClick={() => handleRemoveCard(item.id)}
					>
						<X />
					</Button>
				)}
			</div>
		);
	};
	const handleAddCard = (cardId: string) => {
		const cardToAdd = allAvailableCards.find((card) => card.id === cardId);
		if (cardToAdd) {
			setDashboardItems([...dashboardItems, cardToAdd]);
		}
	};
	const handleRemoveCard = (cardId: string) => {
		setDashboardItems((prevItems) =>
			prevItems.filter((item) => item.id !== cardId),
		);
	};
	const handleResetCards = () => {
		setDashboardItems(initialDashboardLayout);
	};
	const nonSelectedCards = allAvailableCards.filter(
		(availableCard) =>
			!dashboardItems.some(
				(dashboardCard) => dashboardCard.id === availableCard.id,
			),
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex justify-center gap-4">
				<DatePicker date={date} setDate={setDate} />

				<Button
					variant="outline"
					className="text-muted"
					onClick={() => setIsSortingDisabled(!isSortingDisabled)}
				>
					<Settings />
				</Button>
			</div>
			<div
				className={cn(
					"flex flex-col items-center",
					!isSortingDisabled
						? "border border-dashed rounded-lg border-foreground"
						: "",
				)}
			>
				<SortableList
					items={dashboardItems}
					onChange={setDashboardItems}
					listClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
					sortingStrategy={rectSortingStrategy}
					renderItem={renderDashboardItem}
					disabled={isSortingDisabled}
				/>
				{!isSortingDisabled && (
					<div>
						<AddCardPopover
							availableCards={nonSelectedCards}
							onAddCard={handleAddCard}
						/>
						<ResetCards onResetCard={handleResetCards} />
					</div>
				)}
			</div>
		</div>
	);
}
