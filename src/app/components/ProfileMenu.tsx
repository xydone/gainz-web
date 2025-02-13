"use client";

import { useUserContext } from "../context";
import { Button } from "@/components/ui/button";

export default function ProfileMenu({
  isVisible,
  toggleVisibility,
  displayName,
  setDisplayName,
}: {
  isVisible: boolean;
  toggleVisibility: () => void;
  displayName: string | null;
  setDisplayName: (name: string | null) => void;
}) {
  const context = useUserContext();
  const toggleMenu = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("displayName");
    toggleVisibility();
    context.setAccessToken(null);
    context.setIsSignedIn(false);
    setDisplayName(null);
  };

  return (
    <>
      {isVisible && (
        <div
          className="flex-col p-4 text-center items-center absolute z-10 bg-primary text-foreground pb-[1em] right-0 top-12"
          id="profile-container"
        >
          <p>{displayName}</p>
          <Button
            onClick={toggleMenu}
            className="bg-accent text-white cursor-pointer px-[2em] py-[0.5em] rounded-lg border-none hover:bg-accent active:bg-accent-strong"
          >
            Sign out
          </Button>
        </div>
      )}
    </>
  );
}
