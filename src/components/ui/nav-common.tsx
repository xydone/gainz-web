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
import { handleSignOut, useUserContext } from "@/app/context";
import { Input } from "./input";
import { z } from "zod";

import { useState, Dispatch, SetStateAction } from "react";
import { Button } from "./button";

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

export function ProfileMenu() {
  const user = useUserContext();
  const signOut = () => {
    handleSignOut(user);
  };
  return (
    <div className="flex flex-col gap-3">
      <p className="text-center">Hello, {user.displayName}!</p>
      <Button variant="outline" className="place-self-center" onClick={signOut}>
        Sign out
      </Button>
    </div>
  );
}
