import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Food } from "../search/columns";
import { DataTable } from "@/components/ui/datatable";
import { dropdownColumns } from "../search/dropdowncolumns";
import { axiosInstance } from "@/lib/api";
import { useUserContext } from "../context";
import { Input } from "@/components/ui/input";

interface TableDialogProps {
  food: Food;
}

const FormSchema = z.object({
  meal: z.string(),
  amount: z.coerce.number(),
  serving: z.coerce.number(),
});
export default function TableDialog({ food }: TableDialogProps) {
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [isAddOpen, setAddOpen] = useState(false);
  const [isResponseOkay, setResponseOkay] = useState<boolean | null>(null);
  const user = useUserContext();
  const handleDetailsOpen = () => {
    setDetailsOpen(true);
  };
  const handleAddOpen = () => {
    setAddOpen(true);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    axiosInstance
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/entry`,
        {
          food_id: food.id,
          meal_category: data.meal,
          amount: data.amount,
          serving_id: data.serving,
        },
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      )
      .then(() => {
        setResponseOkay(true);
      })
      .catch((error) => {
        console.error(error);
        setResponseOkay(false);
      });
  }

  return (
    <div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleDetailsOpen}>
              Expand details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAddOpen}>
              Add to entries
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Dialog open={isDetailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>View details</DialogTitle>
            <DataTable columns={dropdownColumns} data={[food]} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-xl w-5/6">
          <DialogHeader>
            <DialogTitle>Add {food.food_name} to entries</DialogTitle>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
              >
                <div className="flex gap-5 flex-col sm:flex-row">
                  <FormField
                    control={form.control}
                    name="meal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meal Type</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="w-full sm:w-40">
                              <SelectValue placeholder="Select a meal type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-background">
                            <SelectItem value="breakfast">Breakfast</SelectItem>
                            <SelectItem value="lunch">Lunch</SelectItem>
                            <SelectItem value="dinner">Dinner</SelectItem>
                            <SelectItem value="misc">Misc</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className=""
                            placeholder="Amount"
                            onChange={field.onChange}
                            // value={field.value}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="serving"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Serving</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="w-[100%] sm:max-w-36 sm:w-36">
                              <SelectValue placeholder="Serving" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-background">
                            {food.servings.map((serving) => (
                              <SelectItem
                                key={serving.id}
                                value={`${serving.id}`}
                              >
                                {serving.amount} {serving.unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  variant="outline"
                  className="active:bg-accent-strong"
                  type="submit"
                >
                  Submit
                </Button>
              </form>
            </Form>
            {isResponseOkay === true && (
              <h1 className="">Success! You may close this window now.</h1>
            )}
            {isResponseOkay === false && (
              <h1 className="text-red-500">Error! Please try again.</h1>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
