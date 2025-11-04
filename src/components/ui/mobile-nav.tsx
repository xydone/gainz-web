"use client";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import {
	ChevronDown,
	CircleUser,
	LogIn,
	Menu,
	Moon,
	Sun,
	User,
} from "lucide-react";

import { useUserContext } from "@/app/context";
import { navLinksConfig } from "@/config/nav-links";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useTheme } from "next-themes";
import Link from "next/link";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogTitle } from "./dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./dropdown-menu";
import { ProfileMenu, SignUpForm, SignInForm } from "./nav-common";
import { Separator } from "./separator";
export default function MobileNav({ className }: { className?: string }) {
	const { theme, setTheme } = useTheme();
	const [isSignInOpen, setSignInOpen] = useState(false);
	const [isSignUpOpen, setSignUpOpen] = useState(false);
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
												{item.popover && index !== item.popover.length - 1 && (
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
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline">
						<User />
					</Button>
				</DropdownMenuTrigger>
				<MenuManager
					setSignInOpen={setSignInOpen}
					setSignUpOpen={setSignUpOpen}
				/>
			</DropdownMenu>
			<Dialog open={isSignInOpen} onOpenChange={setSignInOpen}>
				<DialogContent>
					<DialogTitle>Sign-in</DialogTitle>
					<SignInForm setOpen={setSignInOpen} />
				</DialogContent>
			</Dialog>

			<Dialog open={isSignUpOpen} onOpenChange={setSignUpOpen}>
				<DialogContent>
					<DialogTitle>Sign-up</DialogTitle>
					<SignUpForm setOpen={setSignUpOpen} />
				</DialogContent>
			</Dialog>
		</nav>
	);
}

function MenuManager({
	setSignInOpen,
	setSignUpOpen,
}: {
	setSignInOpen: Dispatch<SetStateAction<boolean>>;
	setSignUpOpen: Dispatch<SetStateAction<boolean>>;
}) {
	const user = useUserContext();
	if (user.isSignedIn) return <ProfileMenu className="mx-5" user={user} />;
	return (
		<DropdownMenuContent className="mx-5">
			<DropdownMenuItem onClick={() => setSignInOpen(true)}>
				<CircleUser />
				Sign-in
			</DropdownMenuItem>

			<DropdownMenuItem onClick={() => setSignUpOpen(true)}>
				<LogIn />
				Sign-up
			</DropdownMenuItem>
		</DropdownMenuContent>
	);
}
