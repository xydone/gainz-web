"use client";
import Menu from "./MenuButton";
import ThemeIcon from "./ThemeIcon";
import Profile from "./ProfileButton";
import Link from "next/link";
import { useState } from "react";
export default function Nav() {
  const links = [
    {
      name: "Home",
      url: "/",
    },
    {
      name: "Entries",
      url: "/entries",
    },
    {
      name: "Statistics",
      url: "/stats",
    },
    {
      name: "Search",
      url: "/search",
    },
    {
      name: "Create",
      url: "/food",
    },
  ];
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };
  return (
    <nav className="flex justify-between items-center bg-primary px-5 py-2.5 overflow-scroll sm:overflow-hidden overflow-y-hidden[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:h-0.5 [&::-webkit-scrollbar-thumb]:bg-accent_strong [&::-webkit-scrollbar-thumb]:rounded-md">
      <Menu toggleNav={toggleNav} />
      <div
        className={`${
          isNavOpen ? "flex" : "hidden"
        } mr-8 sm:flex gap-[1em] last-child:mr-[2em]`}
      >
        {links.map((link, i) => (
          <Link
            key={i}
            href={link.url}
            className="no-underline hover:underline"
          >
            {link.name}
          </Link>
        ))}
      </div>
      <div className="flex flex-1 justify-end">
        <ThemeIcon />
        <Profile />
      </div>
    </nav>
  );
}
