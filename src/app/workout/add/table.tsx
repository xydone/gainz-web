"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SortableTableRow } from "./table-row";
import { axiosInstance } from "@/lib/api";
import { useUserContext } from "@/app/context";
import { useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { ControllerRenderProps } from "react-hook-form";
import { AddExerciseSchema } from "./add-exercises";
import { z } from "zod";

interface WorkoutExercise {
  id: string;
  exercise_id: string;
  notes: string;
  sets: number;
  reps: number;
}

const INITIAL_DATA: WorkoutExercise[] = [];

export function EditableTable({
  field,
}: {
  field: ControllerRenderProps<z.infer<typeof AddExerciseSchema>>;
}) {
  const user = useUserContext();
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
    queryKey: ["getExercises", user.accessToken],
    enabled: !user.loading,
    queryFn: fetchData,
  });

  const [items, setItems] = useState<WorkoutExercise[]>(INITIAL_DATA);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleInputChange = (
    id: string | number,
    fieldKey: keyof WorkoutExercise,
    value: string | number
  ) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [fieldKey]: value };
        console.log(fieldKey);
        if (fieldKey === "sets") {
          console.log({ updatedItem });
          updatedItem.sets = parseInt(value as string, 10) || 0;
        } else if (fieldKey === "reps") {
          updatedItem.reps = parseInt(value as string, 10) || 0;
        }

        return updatedItem;
      }
      return item;
    });

    setItems(updatedItems);
    field.onChange(updatedItems);
  };

  const handleAddItem = () => {
    const newItem: WorkoutExercise = {
      id: uuidv4(),
      exercise_id: "",
      notes: "",
      sets: 0,
      reps: 0,
    };
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((currentItems) => {
        const oldIndex = currentItems.findIndex(
          (item) => item.id === active.id
        );
        const newIndex = currentItems.findIndex((item) => item.id === over.id);
        return arrayMove(currentItems, oldIndex, newIndex);
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Exercises</CardTitle>
        <Button
          type="button"
          variant={"outline"}
          className={"mt-3 self-center mb-3"}
          onClick={handleAddItem}
        >
          Add New Exercise
        </Button>
      </CardHeader>
      <CardContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-2/f">Exercise name</TableHead>
                <TableHead>Sets</TableHead>
                <TableHead>Reps</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <SortableContext
              items={items.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <TableBody>
                {items.map((item) => (
                  <SortableTableRow
                    exercises={exercises}
                    key={item.id}
                    item={item}
                    handleInputChange={handleInputChange}
                    handleDeleteItem={handleDeleteItem}
                  />
                ))}
              </TableBody>
            </SortableContext>
          </Table>
        </DndContext>
      </CardContent>
    </Card>
  );
}
