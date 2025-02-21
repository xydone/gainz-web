import CalorieDistribution from "./calorie-distribution";
import Weight from "./weight";

export default function SignedIn() {
  return (
    <div>
      <div className="flex flex-row gap-5 mx-5">
        <CalorieDistribution className="size-1/4" />
        <Weight className="size-1/4" />
      </div>
    </div>
  );
}
