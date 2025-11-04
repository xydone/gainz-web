"use client";

import { Separator } from "@/components/ui/separator";
import { ChevronDown, LogIn, CircleUser, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useUserContext } from "@/app/context";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { navLinksConfig } from "@/config/nav-links";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { ProfileMenu, SignInForm, SignUpForm } from "./nav-common";

export default function MainNav({ className }: { className?: string }) {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [isSignInOpen, setIsSignInOpen] = useState(false);
	const [isSignUpOpen, setIsSignUpOpen] = useState(false);
	useEffect(() => setMounted(true), []);
	return (
		<nav className={cn("hidden md:flex flex-row gap-5", className)}>
			{navLinksConfig.nav.map((item, index) => {
				if (!item.popover) {
					return (
						<Button variant="ghost" key={index} asChild>
							<Link href={`${item.href}`}>Home</Link>
						</Button>
					);
				}
				return (
					<Popover key={index}>
						<PopoverTrigger asChild>
							<Button variant="ghost">
								{item.title}
								<ChevronDown />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-full flex flex-col">
							{item.popover.map((popoverItem, index) => (
								<div key={index}>
									<Link href={`${popoverItem.href}`}>{popoverItem.title}</Link>
									{item.popover && index !== item.popover.length - 1 && (
										<Separator className="my-2" />
									)}
								</div>
							))}
						</PopoverContent>
					</Popover>
				);
			})}
			<div className="flex flex-row gap-5 ml-auto">
				{mounted && theme === "dark" ? (
					<Button variant="outline" onClick={() => setTheme("light")}>
						<Sun />
					</Button>
				) : (
					<Button variant="outline" onClick={() => setTheme("dark")}>
						<Moon />
					</Button>
				)}

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">
							<User />
						</Button>
					</DropdownMenuTrigger>
					<MenuManager
						setIsSignInOpen={setIsSignInOpen}
						setIsSignUpOpen={setIsSignUpOpen}
					/>
				</DropdownMenu>

				<Dialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Sign-up</DialogTitle>
						</DialogHeader>
						<SignUpForm setOpen={setIsSignUpOpen} />
					</DialogContent>
				</Dialog>
				<Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Sign-in</DialogTitle>
						</DialogHeader>
						<SignInForm setOpen={setIsSignInOpen} />
					</DialogContent>
				</Dialog>
			</div>
		</nav>
	);
}

function MenuManager({
	setIsSignInOpen,
	setIsSignUpOpen,
}: {
	setIsSignUpOpen: Dispatch<SetStateAction<boolean>>;
	setIsSignInOpen: Dispatch<SetStateAction<boolean>>;
}) {
	const user = useUserContext();

	if (user.isSignedIn) return <ProfileMenu user={user} />;
	return (
		<DropdownMenuContent>
			<DropdownMenuItem onClick={() => setIsSignInOpen(true)}>
				<CircleUser />
				Sign-in
			</DropdownMenuItem>
			<DropdownMenuItem onClick={() => setIsSignUpOpen(true)}>
				<LogIn />
				Sign-up{" "}
			</DropdownMenuItem>
		</DropdownMenuContent>
	);
}
