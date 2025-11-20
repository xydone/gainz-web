import type { NavItem } from "../types/nav";

export interface NavLinksConfig {
	nav: NavItem[];
}

export const navLinksConfig: NavLinksConfig = {
	nav: [
		{
			title: "Home",
			href: "/",
		},
		{
			title: "Food",
			popover: [
				{ title: "Create Food", href: "/food/add" },
				{ title: "Log Food", href: "/food/entries/search" },
				{ title: "Daily Food Data", href: "/data/daily" },
				{ title: "Raw Food Entry Data", href: "/food/entries/raw" },
			],
		},
		{
			title: "Exercise",
			popover: [
				{ title: "Create Exercise", href: "/exercise/add" },
				{ title: "Log Exercise", href: "/exercise/log" },
				{ title: "Create Workout", href: "/workout/add" },
				{ title: "Log Workout", href: "/workout/log" },
			],
		},
		{
			title: "Data",
			popover: [
				{ title: "View Progress", href: "/data/progress" },
				{ title: "View Exercise Data", href: "/exercise/data" },
			],
		},
	],
};
