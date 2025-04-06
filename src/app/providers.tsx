"use client";

import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { UserContext, User } from "./context";
import { AxiosInterceptor } from "@/lib/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const user: User = {
    accessToken,
    setAccessToken,
    refreshToken,
    setRefreshToken,
    isSignedIn,
    setIsSignedIn,
    loading,
    setLoading,
  };
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <UserContext.Provider value={user}>
        <QueryClientProvider client={queryClient}>
          <AxiosInterceptor />
          <link rel="icon" href="/favicon/favicon-16x16.svg" />
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </UserContext.Provider>
    </ThemeProvider>
  );
}
