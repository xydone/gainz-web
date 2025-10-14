"use client";

import { useUserContext } from "../../context";
import Loading from "../../loading";
import { redirect } from "next/navigation";
import { useGetExercises, useLogExercise } from "./log.service";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useGetExerciseUnits } from "../data/entry.service";
import { Input } from "@/components/ui/input";

export default function ExerciseData() {
  const user = useUserContext();
  const { data } = useGetExercises();
  const { data: units } = useGetExerciseUnits();

  const FormSchema = z.object({
    exercise_id: z.coerce.number(),
    unit_id: z.coerce.number(),
    value: z.coerce.number(),
    notes: z.string().optional(),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const formValues = form.watch();

  const { mutate } = useLogExercise({
    exercise_id: formValues.exercise_id,
    unit_id: formValues.unit_id,
    value: formValues.value,
    notes: formValues.notes ?? null,
    callback: () => {},
  });

  if (user.loading) return <Loading />;
  if (!user.isSignedIn) return redirect("/");

  const onSubmit = async () => {
    mutate();
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <h1 className="text-xl">Log Exercise</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-2/3 sm:w-1/3 flex-col gap-5"
        >
          <div className="flex gap-5 flex-col sm:flex-col">
            <FormField
              control={form.control}
              name="exercise_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exercise</FormLabel>
                  <Select
                    value={`${field.value}`}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover">
                      {data &&
                        data.map((exercise) => (
                          <SelectItem
                            key={exercise.id}
                            value={`${exercise.id}`}
                          >
                            {exercise.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <Select
                    value={`${field.value}`}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover">
                      {units &&
                        units.map((unit) => (
                          <SelectItem key={unit.id} value={`${unit.id}`}>
                            {unit.unit}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <Input
                    type="number"
                    className=""
                    placeholder="Value"
                    onChange={field.onChange}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input
                      className=""
                      placeholder="(optional)"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button
            variant="outline"
            className="active:bg-accent-strong w-auto"
            type="submit"
          >
            Log
          </Button>
        </form>
      </Form>
    </div>
  );
}
