"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import Search from "./search/page";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Create from "./add-food/page";
import AddExercise from "./add-exercise/page";

export default function QuickAdd({ className }: { className?: string }) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>Quick Add</CardTitle>
        <CardDescription>Add all that you need</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <LogFoodMenu />
        <AddFoodMenu />
        <LogExerciseMenu />
        <AddExerciseMenu />
      </CardContent>
    </Card>
  );
}

function LogFoodMenu() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Log food
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Search for food</DialogTitle>
          </DialogHeader>
        </VisuallyHidden>
        <Search />
      </DialogContent>
    </Dialog>
  );
}

function AddFoodMenu() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Add food
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90%] overflow-auto">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Add food</DialogTitle>
          </DialogHeader>
        </VisuallyHidden>
        <Create />
      </DialogContent>
    </Dialog>
  );
}

function LogExerciseMenu() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Log exercise
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90%] overflow-auto">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Log exercise</DialogTitle>
          </DialogHeader>
        </VisuallyHidden>
        {/* fill in here */}
      </DialogContent>
    </Dialog>
  );
}

function AddExerciseMenu() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Add exercise
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90%] overflow-auto">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Add exercise</DialogTitle>
          </DialogHeader>
        </VisuallyHidden>
        <AddExercise innerDivClassName="lg:w-full" />
      </DialogContent>
    </Dialog>
  );
}
