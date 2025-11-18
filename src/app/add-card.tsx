import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { DashboardItem } from "./signed-in";
import { MacronutrientMap } from "./types";

interface AddCardPopoverProps {
	availableCards: DashboardItem[];
	onAddCard: (cardId: string) => void;
}

const getCardDisplayName = (card: DashboardItem): string => {
	const componentName = card.component.replace(/([A-Z])/g, " $1").trim();
	// if this is present then its a goals card
	const goalName = card.props?.goalName;
	if (goalName) {
		return `Goals - ${MacronutrientMap[goalName]}`;
	}
	return componentName;
};

export function AddCardPopover({
	availableCards,
	onAddCard,
}: AddCardPopoverProps) {
	const [open, setOpen] = useState(false);

	const handleSelect = (cardId: string) => {
		onAddCard(cardId);
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" className="m-2">
					<Plus />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-0">
				<Command>
					<CommandInput placeholder="Search cards" />
					<CommandList>
						<CommandEmpty>No available cards.</CommandEmpty>
						<CommandGroup heading="Available Cards">
							{availableCards.map((card) => (
								<CommandItem
									key={card.id}
									value={getCardDisplayName(card)}
									onSelect={() => handleSelect(card.id)}
								>
									{getCardDisplayName(card)}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
