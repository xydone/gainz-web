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
import { EditableTable } from "./table";

export const AddExerciseSchema = z.object({
  workout_id: z.coerce.number(),
  exercises: z.array(
    z.object({
      exercise_id: z.coerce.number(),
      notes: z.string(),
      sets: z.coerce.number(),
      reps: z.coerce.number(),
    })
  ),
});

interface WorkoutResponse {
  id: number;
  name: string;
  created_at: number;
  created_by: number;
}

export default function AddExercises({ className }: { className?: string }) {
  const user = useUserContext();

  const form = useForm<z.infer<typeof AddExerciseSchema>>({
    resolver: zodResolver(AddExerciseSchema),
  });
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/workout/`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const { data: workouts } = useQuery({
    queryKey: ["getWorkouts", user.accessToken],
    enabled: !user.loading,
    queryFn: fetchData,
  });

  const { mutate, error } = useMutation({
    mutationFn: async (form: z.infer<typeof AddExerciseSchema>) => {
      try {
        const { workout_id, exercises } = form;
        const response = await axiosInstance.post(
          `${process.env.NEXT_PUBLIC_API_URL}/workout/${workout_id}/exercises`,
          exercises
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
            <CardDescription>Add exercises to workout.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <FormField
              control={form.control}
              name={"workout_id"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workout</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an exercise" />
                      </SelectTrigger>
                      <SelectContent>
                        {workouts &&
                          workouts.map((element: WorkoutResponse) => (
                            <SelectItem
                              value={`${element.id}`}
                              key={element.id}
                              onChange={field.onChange}
                            >
                              {element.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"exercises"}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <EditableTable field={field} />
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
