import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "./page";
import { z } from "zod";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Macronutrients({
  form,
  className,
}: {
  form: UseFormReturn<z.infer<typeof FormSchema>>;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapsible
      className={cn("w-1/2 mt-5", className)}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <Card>
        <CollapsibleTrigger className="flex flex-col space-y-1.5 text-left w-full">
          <CardHeader>
            <CardTitle>Macronutrients</CardTitle>
            <CardDescription>
              ~click to {isOpen == false ? "expand" : "collapse"}~
            </CardDescription>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent
          forceMount={true}
          className="data-[state=closed]:hidden"
        >
          <CardContent className="grid gap-5">
            <FormField
              control={form.control}
              name={"calories"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calories</FormLabel>
                  <FormControl>
                    <Input onChange={field.onChange} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"protein"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Protein</FormLabel>
                  <FormControl>
                    <Input onChange={field.onChange} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"carbs"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total carbs</FormLabel>
                  <FormControl>
                    <Input onChange={field.onChange} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"fat"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total fats</FormLabel>
                  <FormControl>
                    <Input onChange={field.onChange} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
