import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUserContext } from "../context";
import { useForm } from "react-hook-form";
import { axiosInstance } from "@/lib/api";
import { useState, Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";

export const FormSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().optional(),
});

export default function Category({
  className,
  setCategoryUpdate,
  categoryUpdate,
}: {
  className?: string;
  setCategoryUpdate: Dispatch<SetStateAction<number>>;
  categoryUpdate: number;
}) {
  const user = useUserContext();

  const [isAPIOkay, setApiOkay] = useState<boolean | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    axiosInstance
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/exercise/category`,
        { ...data },
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      )
      .then(() => {
        setApiOkay(true);
        setCategoryUpdate(categoryUpdate + 1);
      });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn(className)}>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>{`Category`}</CardTitle>
            <CardDescription>Create a new category.</CardDescription>
            <CardDescription>(e.g. cardio, chest, bicep)</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <FormField
              control={form.control}
              name={"name"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input onChange={field.onChange} className="max-w-[95%]" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"description"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      onChange={field.onChange}
                      placeholder="Optional"
                      className="max-w-[95%]"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <Button
            type="submit"
            variant={"outline"}
            className={"mt-3 self-center mb-3"}
            disabled={!user.isSignedIn}
          >
            Submit
          </Button>
          {isAPIOkay == false && (
            <CardDescription className="self-center mb-3 text-destructive">
              Error! Please try again.
            </CardDescription>
          )}
        </Card>
      </form>
    </Form>
  );
}
