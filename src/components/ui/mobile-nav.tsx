"use client";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
  DrawerHeader,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ChevronDown, Menu, Moon, Sun, User } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { Separator } from "./separator";
import { navLinksConfig } from "@/config/nav-links";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useUserContext } from "@/app/context";
import { ProfileMenu, SignInForm } from "./nav-common";
export default function MobileNav({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <nav className={cn("flex flex-row gap-5 md:hidden", className)}>
      <Drawer>
        <DrawerTrigger className="mr-auto" asChild>
          <Button variant="outline">
            <Menu />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <VisuallyHidden>
              <DrawerTitle>Contents</DrawerTitle>
            </VisuallyHidden>
          </DrawerHeader>
          <div className="flex flex-col mx-5">
            {navLinksConfig.nav.map((item, index) => {
              if (!item.popover) {
                return (
                  <Button variant="ghost" key={index} className="justify-start">
                    <Link href={`${item.href}`}>Home</Link>
                  </Button>
                );
              }
              return (
                <Popover key={index}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="justify-start">
                      {item.title}
                      <ChevronDown />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full flex flex-col">
                    {item.popover.map((popoverItem, index) => (
                      <div key={index}>
                        <Link href={`${popoverItem.href}`}>
                          {popoverItem.title}
                        </Link>
                        {item.popover && index != item.popover.length - 1 && (
                          <Separator className="my-2" />
                        )}
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>
      {mounted && theme === "dark" ? (
        <Button variant="outline" onClick={() => setTheme("light")}>
          <Sun />
        </Button>
      ) : (
        <Button variant="outline" onClick={() => setTheme("dark")}>
          <Moon />
        </Button>
      )}

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline">
            <User />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <MenuManager setOpen={setOpen} />
        </DrawerContent>
      </Drawer>
    </nav>
  );
}

function MenuManager({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const user = useUserContext();
  if (user.isSignedIn)
    return (
      <div className="mx-5">
        <DrawerTitle className="mb-3">Profile</DrawerTitle>
        <ProfileMenu />
      </div>
    );
  return (
    <div className="mx-5">
      <DrawerTitle className="mb-3">Sign-in</DrawerTitle>
      <SignInForm setOpen={setOpen} />
    </div>
  );
}
