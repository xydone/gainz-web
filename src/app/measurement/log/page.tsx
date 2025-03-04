"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { axiosInstance } from "@/lib/api";
import { useUserContext } from "@/app/context";
const FormSchema = z.object({
  type: z.string().nonempty(),
  value: z.coerce.number({
    message: "Must be a number and cannot be empty!",
  }),
  date: z.date().optional(),
});

export default function MeasurementLog() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const user = useUserContext();
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}/user/measurement`,
      { ...data },
      { headers: { Authorization: `Bearer ${user.accessToken}` } }
    );
  };
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <h1 className="text-xl">Log measurement</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-2/3 flex-col gap-5"
        >
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Measurement Type</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background">
                    <SelectItem value="weight">Weight</SelectItem>
                    <SelectItem value="waist">Waist</SelectItem>
                    <SelectItem value="hips">Hips</SelectItem>
                    <SelectItem value="neck">Neck</SelectItem>
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
                <FormControl>
                  <Input
                    className=""
                    placeholder="Value"
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            defaultValue={new Date()}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Measurement date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="m-10" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          <Button
            variant="outline"
            className="active:bg-accent-strong"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
