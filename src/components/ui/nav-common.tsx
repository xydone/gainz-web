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
import axios, { AxiosError } from "axios";
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

export enum SignInStatus {
  successful,
  rejected,
  serverError,
}

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
  const [signInStatus, setSignInStatus] = useState<SignInStatus | undefined>(
    undefined
  );
  function onSubmit(data: z.infer<typeof FormSchema>) {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
        username: data.username,
        password: data.password,
      })
      .then((response) => {
        const { access_token, refresh_token } = response.data;

        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);
        setOpen(false);
        user.setAccessToken(access_token);
        user.setRefreshToken(refresh_token);
        user.setIsSignedIn(true);
      })
      .catch((error: AxiosError) => {
        if (error.status == 401) {
          setSignInStatus(SignInStatus.rejected);
        } else {
          setSignInStatus(SignInStatus.serverError);
        }
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
        {signInStatus === SignInStatus.rejected && (
          <ErrorMessage>
            Sign in failed! Check your credentials and try again.
          </ErrorMessage>
        )}

        {signInStatus === SignInStatus.serverError && (
          <ErrorMessage>
            A server error occurred while signing in. Please try again later!
          </ErrorMessage>
        )}
      </form>
    </Form>
  );
}

const ErrorMessage = ({ children }: { children: React.ReactNode }) => (
  <p className="text-destructive text-center">{children}</p>
);

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
        Profile
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
