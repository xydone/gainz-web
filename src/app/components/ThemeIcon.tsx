"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import MoonIcon from "./MoonIcon";
import SunIcon from "./SunIcon";
export default function ThemeIcon() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <button
      className="background-none"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {mounted && theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
