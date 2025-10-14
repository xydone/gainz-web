import React, { useState } from "react";
import {
  DetailedNutrients,
  Entry,
  ImportantNutrients,
  NameColumns,
} from "./BasicColumn";
import { useEditEntry, useDeleteEntry, useGetFood } from "./table.service";
import {
  Select,
  SelectContent,
  SelectGroup,
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

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import TableDialog from "./TableDialog";
import { Button } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { useUserContext } from "@/app/context";
export function ManageMenu({
  entry,
  handleDeleted,
  handleEdited,
}: {
  entry: Entry;
  handleDeleted: () => void;
  handleEdited: () => void;
}) {
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const user = useUserContext();
  // const { refetch: deleteRefetch } = useDeleteEntry({ id: entry.entry_id });
  const { mutate: deleteMutate } = useDeleteEntry({
    id: entry.id,
    callback: () => {
      setDeleteOpen(false);
      handleDeleted();
    },
  });
  const {
    data,
    isFetching,
    refetch: getFoodRefetch,
  } = useGetFood({ id: entry.food_id });
  const FormSchema = z.object({
    meal: z.string(),
    amount: z.coerce.number(),
    serving: z.coerce.number(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      meal: entry.category,
      amount: entry.amount,
      serving: entry.serving_id,
    },
  });

  const formValues = form.watch();
  const { mutate } = useEditEntry({
    id: entry.id,
    category: formValues.meal,
    amount: formValues.amount,
    serving_id: formValues.serving,
    callback: () => {
      handleEdited();
      setEditOpen(false);
    },
  });
  const onSubmit = async () => {
    if (!user.accessToken) return;
    mutate();
  };

  const columns = [
    ...NameColumns<Entry>(),
    ...ImportantNutrients<Entry>(),
    ...DetailedNutrients,
  ];
  return (
    <div>
      <div>
        <TableDialog
          columns={columns}
          data={[entry]}
          dialogs={[
            {
              title: "Edit entry",
              isOpen: isEditOpen,
              setOpen: setEditOpen,
              onClick: () => {
                getFoodRefetch();
              },
            },
            {
              title: "Delete entry",
              isOpen: isDeleteOpen,
              setOpen: setDeleteOpen,
              onClick: () => {},
            },
          ]}
          hasExpandDetails
        />
      </div>
      {isEditOpen && <EditDialog />}
      <DeleteDialog />
    </div>
  );

  function EditDialog() {
    if (isFetching) return;
    return (
      <Dialog open={isEditOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-xl w-5/6">
          <DialogHeader>
            <DialogTitle>Edit your entry for {entry.food.food_name}</DialogTitle>
          </DialogHeader>
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
                      <Select
                        onValueChange={field.onChange}
                        value={`${field.value}`}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full sm:w-40">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-background">
                          <SelectGroup>
                            <SelectItem value="breakfast">Breakfast</SelectItem>
                            <SelectItem value="lunch">Lunch</SelectItem>
                            <SelectItem value="dinner">Dinner</SelectItem>
                            <SelectItem value="misc">Misc</SelectItem>
                          </SelectGroup>
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
                          value={field.value}
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
                      <Select
                        value={`${field.value}`}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[100%] sm:max-w-36 sm:w-36">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-background">
                          {data.servings.map((serving) => (
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
                Edit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
  function DeleteDialog() {
    return (
      <Dialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-xl w-5/6">
          <DialogHeader>
            <DialogTitle>Delete your entry for {entry.food.food_name}</DialogTitle>
          </DialogHeader>
          <Button
            variant="destructive"
            onClick={() => {
              deleteMutate();
            }}
          >
            Delete
          </Button>
        </DialogContent>
      </Dialog>
    );
  }
}
