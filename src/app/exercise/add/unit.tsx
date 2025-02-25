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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUserContext } from "@/app/context";
import { useForm } from "react-hook-form";
import { axiosInstance } from "@/lib/api";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const FormSchema = z.object({
  amount: z.coerce.number().min(1),
  unit: z.string().nonempty(),
  multiplier: z.coerce.number().min(1),
  exercise_id: z.coerce.number(),
});

interface Response {
  id: number;
  name: string;
  description: string;
}

export default function Unit({ className }: { className?: string }) {
  const user = useUserContext();

  const [isAPIOkay, setApiOkay] = useState<boolean | null>(null);
  const [exercises, setExercises] = useState<Response[] | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    if (user.isSignedIn) {
      axiosInstance
        .get(`${process.env.NEXT_PUBLIC_API_URL}/exercise/`)
        .then((response) => {
          setExercises(response.data);
        });
    }
  }, [user.isSignedIn]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    axiosInstance
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/exercise/unit`,
        { ...data },
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      )
      .then(() => {
        setApiOkay(true);
      });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn(className)}>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>{`Unit`}</CardTitle>
            <CardDescription>Create a new data unit.</CardDescription>
            <CardDescription>(e.g. grams, mililiters)</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <FormField
              control={form.control}
              name={"amount"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input onChange={field.onChange} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"unit"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input onChange={field.onChange} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"multiplier"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Multiplier</FormLabel>
                  <FormControl>
                    <Input onChange={field.onChange} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"exercise_id"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an exercise" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {exercises &&
                        exercises.map((element) => (
                          <SelectItem value={`${element.id}`} key={element.id}>
                            {element.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
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
