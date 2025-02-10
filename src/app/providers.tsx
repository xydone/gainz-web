"use client";

import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { UserContext, User } from "./context";
export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const user: User = {
    accessToken,
    setAccessToken,
    isSignedIn,
    setIsSignedIn,
  };
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <UserContext.Provider value={user}>{children}</UserContext.Provider>
    </ThemeProvider>
  );
}
