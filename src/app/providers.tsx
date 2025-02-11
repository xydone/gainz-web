"use client";

import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { UserContext, User } from "./context";
import { AxiosInterceptor } from "@/lib/api";
export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const user: User = {
    accessToken,
    setAccessToken,
    refreshToken,
    setRefreshToken,
    isSignedIn,
    setIsSignedIn,
  };
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <UserContext.Provider value={user}>
        <AxiosInterceptor />
        {children}
      </UserContext.Provider>
    </ThemeProvider>
  );
}
