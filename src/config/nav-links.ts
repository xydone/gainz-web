import { NavItem } from "../types/nav";

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
      title: "Log",
      popover: [
        { title: "Log Meal", href: "/food/entries/search" },
        { title: "Log Exercise", href: "/exercise/search" },
        { title: "Log Measurement", href: "/measurement/log" },
        { title: "Log Workout", href: "/workout/log" },
      ],
    },
    {
      title: "Create",
      popover: [
        { title: "Create Food", href: "/food/add" },
        { title: "Create Exercise", href: "/exercise/add" },
        { title: "Create Workout", href: "/workout/add" },
      ],
    },
    {
      title: "Data",
      popover: [
        { title: "View Daily Intake", href: "/data/daily" },
        { title: "View Progress", href: "/data/progress" },
        { title: "View Raw Food Entry Data", href: "/food/entries/raw" },
      ],
    },
  ],
};
