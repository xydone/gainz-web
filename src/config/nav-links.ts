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
      title: "Create",
      popover: [
        { title: "Create Food", href: "/add-food" },
        { title: "Create Exercise", href: "/add-exercise" },
      ],
    },
    {
      title: "Log",
      popover: [
        { title: "Log Food", href: "/search" },
        { title: "Log Exercise", href: "/exercise" },
      ],
    },
    {
      title: "View",
      popover: [
        { title: "View Raw Food Entry Data", href: "/entries" },
        { title: "View Food Entry Statistics", href: "/stats" },
      ],
    },
  ],
};
