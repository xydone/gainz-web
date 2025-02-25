import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export default function NoResponse() {
  return (
    <Card className="w-[40%]">
      <CardHeader>
        <CardTitle>Not found</CardTitle>
        <CardDescription>No entries found in the date range</CardDescription>
      </CardHeader>
    </Card>
  );
}
