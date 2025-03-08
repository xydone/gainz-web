export type Nutrients = {
  calories: number;
  fat: number;
  sat_fat: number;
  polyunsat_fat: number;
  monounsat_fat: number;
  trans_fat: number;
  cholesterol: number;
  sodium: number;
  potassium: number;
  carbs: number;
  fiber: number;
  sugar: number;
  protein: number;
  vitamin_a: number;
  vitamin_c: number;
  calcium: number;
  iron: number;
  added_sugars: number;
  vitamin_d: number;
  sugar_alcohols: number;
};
export type GoalTypes = {
  weight: number;
} & Nutrients;
export const NutrientKeys: (keyof Nutrients)[] = [
  "calories",
  "fat",
  "sat_fat",
  "polyunsat_fat",
  "monounsat_fat",
  "trans_fat",
  "cholesterol",
  "sodium",
  "potassium",
  "carbs",
  "fiber",
  "sugar",
  "protein",
  "vitamin_a",
  "vitamin_c",
  "calcium",
  "iron",
  "added_sugars",
  "vitamin_d",
  "sugar_alcohols",
];

export const MacronutrientMap: { [key: string]: string } = {
  calories: "Calories",
  fat: "Fat",
  sat_fat: "Saturated Fat",
  polyunsat_fat: "Polyunsaturated Fat",
  monounsat_fat: "Monounsaturated Fat",
  trans_fat: "Trans Fat",
  cholesterol: "Cholesterol",
  sodium: "Sodium",
  potassium: "Potassium",
  carbs: "Carbs",
  fiber: "Fiber",
  sugar: "Sugar",
  protein: "Protein",
  vitamin_a: "Vitamin A",
  vitamin_c: "Vitamin C",
  calcium: "Calcium",
  iron: "Iron",
  added_sugars: "Added Sugars",
  vitamin_d: "Vitamin D",
  sugar_alcohols: "Sugar Alcohols",
};
