import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { handleSignOut, User, useUserContext } from "@/app/context";
import { Input } from "./input";
import { z } from "zod";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Goal, LogOut, Settings } from "lucide-react";

import { useState, Dispatch, SetStateAction } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const FormSchema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
});

export function SignInForm({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const user = useUserContext();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isFailedSignIn, setFailedSignIn] = useState(false);
  function onSubmit(data: z.infer<typeof FormSchema>) {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
        username: data.username,
        password: data.password,
      })
      .then((response) => {
        const { access_token, refresh_token, display_name } = response.data;

        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);
        localStorage.setItem("displayName", display_name);
        setOpen(false);
        user.setDisplayName(display_name);
        user.setAccessToken(access_token);
        user.setRefreshToken(refresh_token);
        user.setIsSignedIn(true);
      })
      .catch((error) => {
        setFailedSignIn(true);
        console.error(error);
      });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name={"username"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input onChange={field.onChange} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"password"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  onChange={field.onChange}
                  type={showPassword ? "text" : "password"}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3">
          <Checkbox
            className="place-self-center"
            checked={showPassword}
            onCheckedChange={() => setShowPassword(!showPassword)}
          />
          <div>
            <label>Show password</label>
          </div>
        </div>
        <Button
          type="submit"
          variant={"outline"}
          className={"place-self-center"}
          disabled={user.isSignedIn}
        >
          Submit
        </Button>
        {isFailedSignIn && (
          <p className="text-destructive text-center">
            Sign in failed! Check your credentials and try again.
          </p>
        )}
      </form>
    </Form>
  );
}

export function ProfileMenu({
  className,
  user,
}: {
  className?: string;
  user: User;
}) {
  const signOut = () => {
    handleSignOut(user);
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      refresh_token: user.refreshToken,
    });
  };
  return (
    <DropdownMenuContent className={cn("sm:max-w-[425px]", className)}>
      <DropdownMenuLabel className="max-w-52 truncate overflow-hidden whitespace-nowrap">
        {user.displayName}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <Goal />
        Goals
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link className="inherit" href="/settings">
          <Settings />
          Settings
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={signOut}>
        <LogOut />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
