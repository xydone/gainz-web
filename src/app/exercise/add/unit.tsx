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
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";

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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/exercise/`,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const { data: exercises } = useQuery({
    queryKey: ["getExercises"],
    queryFn: fetchData,
  });

  const { mutate, error } = useMutation({
    mutationFn: async (form: FormData) => {
      try {
        const response = await axiosInstance.post(
          `${process.env.NEXT_PUBLIC_API_URL}/exercise/unit`,
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
            <CardTitle>{`Unit`}</CardTitle>
            <CardDescription>Create a new data unit.</CardDescription>
            <CardDescription>(e.g. grams, mililiters)</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <FormField
              control={form.control}
              name={"unit"}
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
                  <FormLabel>Exercise</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an exercise" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {exercises &&
                        exercises.map((element: Response) => (
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
