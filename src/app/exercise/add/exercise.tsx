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
import { cn } from "@/lib/utils";
import { useGetCategory, postExercise } from "./add-exercise.service";

interface Category {
  id: number;
  name: string;
  description?: string;
}

export const FormSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().optional(),
  base_amount: z.coerce.number().min(1),
  base_unit: z.string().nonempty(),
  category_id: z.coerce.number(),
});

export default function Exercise({ className }: { className?: string }) {
  const user = useUserContext();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { data } = useGetCategory();

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    postExercise(data, user);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn(className)}>
        <Card className="mt-5 flex flex-col">
          <CardHeader>
            <CardTitle>{`Exercise`}</CardTitle>
            <CardDescription>
              Create a new exercise without making a new category. The base unit
              is automatically created.
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
            <FormField
              control={form.control}
              name={"description"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input onChange={field.onChange} placeholder="Optional" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"base_amount"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Amount</FormLabel>
                  <FormControl>
                    <Input onChange={field.onChange} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"base_unit"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Unit</FormLabel>
                  <FormControl>
                    <Input onChange={field.onChange} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"category_id"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {data &&
                        data.map((element: Category) => (
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
          {/* {error && (
            <CardDescription className="self-center mb-3 text-destructive">
              Error! Please try again.
            </CardDescription>
          )} */}
        </Card>
      </form>
    </Form>
  );
}
