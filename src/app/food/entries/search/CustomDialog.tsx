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

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Food } from "./columns";
import { DataTable } from "@/components/ui/datatable";
import { dropdownColumns } from "./dropdowncolumns";
import { axiosInstance } from "@/lib/api";
import { useUserContext } from "@/app/context";
import { Input } from "@/components/ui/input";
import TableDialog from "@/components/ui/TableDialog";

interface DialogProps {
  food: Food;
}

const FormSchema = z.object({
  meal: z.string(),
  amount: z.coerce.number(),
  serving: z.coerce.number(),
});
export default function DialogMenu({ food }: DialogProps) {
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [isAddOpen, setAddOpen] = useState(false);
  const [isResponseOkay, setResponseOkay] = useState<boolean | null>(null);
  const [foodData, setFoodData] = useState(food);
  const user = useUserContext();
  const handleAddOpen = () => {
    setAddOpen(true);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleAddToEntries = async () => {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/food/${foodData.id}`,
      {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      }
    );

    setFoodData((prevState) => ({
      ...prevState,
      servings: response.data.servings,
    }));
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    axiosInstance
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/entry`,
        {
          food_id: foodData.id,
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
      <TableDialog
        columns={dropdownColumns}
        data={[foodData]}
        dialogs={[
          {
            isOpen: isAddOpen,
            setOpen: handleAddOpen,
            title: "Add to entries",
            onClick: handleAddToEntries,
          },
        ]}
      />
      <Dialog open={isDetailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>View details</DialogTitle>
            <DataTable columns={dropdownColumns} data={[foodData]} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-xl w-5/6">
          <DialogHeader>
            <DialogTitle>Add {foodData.food_name} to entries</DialogTitle>
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
                              <SelectValue placeholder="Select type" />
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
                            {foodData.servings.map((serving) => (
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
