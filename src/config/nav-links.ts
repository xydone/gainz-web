import { NavItem } from "../types/nav";

export interface NavLinksConfig {
  nav: NavItem[];
}

// export const navLinksConfig: NavLinksConfig = {
//   nav: [
//     {
//       title: "Home",
//       href: "/",
//     },
//     {
//       title: "Create",
//       popover: [
//         { title: "Create Food", href: "/food/add" },
//         { title: "Create Exercise", href: "/exercise/add" },
//       ],
//     },
//     {
//       title: "Log",
//       popover: [
//         { title: "Log Food", href: "/food/entries/search" },
//         { title: "Log Exercise", href: "/exercise/search" },
//         { title: "Log Measurement", href: "/measurement/log" },
//       ],
//     },
//     {
//       title: "View",
//       popover: [
//         { title: "View Raw Food Entry Data", href: "/food/entries" },
//         { title: "View Food Entry Statistics", href: "/food/entries/stats" },
//       ],
//     },
//   ],
// };
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
      ],
    },
    {
      title: "Create",
      popover: [
        { title: "Create Food", href: "/food/add" },
        { title: "Create Exercise", href: "/exercise/add" },
      ],
    },
    {
      title: "Progress",
      popover: [
        { title: "View Progress", href: "/progress" },
        { title: "View Raw Food Entry Data", href: "/food/entries/raw" },
        { title: "View Food Entry Statistics", href: "/food/entries/stats" },
      ],
    },
  ],
};
