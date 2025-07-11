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
import { useUserContext } from "@/app/context";
import { useForm } from "react-hook-form";
import { axiosInstance } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";

export const FormSchema = z.object({
  name: z.string().nonempty(),
});

export default function Workout({ className }: { className?: string }) {
  const user = useUserContext();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { mutate, error } = useMutation({
    mutationFn: async (form: FormData) => {
      try {
        const response = await axiosInstance.post(
          `${process.env.NEXT_PUBLIC_API_URL}/workout`,
          { ...form },
          { headers: { Authorization: `Bearer ${user.accessToken}` } }
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
  return (
    <Form {...form}>
      {/* @ts-expect-error Weird form error */}
      <form onSubmit={form.handleSubmit(mutate)} className={cn(className)}>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>{`Workout`}</CardTitle>
            <CardDescription>Create a new workout.</CardDescription>
            <CardDescription>
              (e.g. push, pull, legs, upper, lower, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <FormField
              control={form.control}
              name={"name"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input onChange={field.onChange} />
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
          {error && (
            <CardDescription className="self-center mb-3 text-destructive">
              Error! Please try again.
            </CardDescription>
          )}
        </Card>
      </form>
    </Form>
  );
}
