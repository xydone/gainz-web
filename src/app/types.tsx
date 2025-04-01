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

export type GoalTypes = {
  weight: number;
} & Nutrients;

export const GoalTypeMap: { [key: string]: string } = {
  weight: "Weight",
  ...MacronutrientMap,
};

export const nutrientChart = {
  calories: {
    label: "Calories",
    color: "var(--calories)",
  },
  fat: {
    label: "Fat",
    color: "var(--fat)",
  },
  sat_fat: {
    label: "Saturated Fat",
    color: "var(--sat-fat)",
  },
  polyunsat_fat: {
    label: "Polyunsaturated Fat",
    color: "var(--polyunsat-fat)",
  },
  monounsat_fat: {
    label: "Monounsaturated Fat",
    color: "var(--monounsat-fat)",
  },
  trans_fat: {
    label: "Trans Fat",
    color: "var(--trans-fat)",
  },
  cholesterol: {
    label: "Cholesterol",
    color: "var(--cholesterol)",
  },
  sodium: {
    label: "Sodium",
    color: "var(--sodium)",
  },
  potassium: {
    label: "Potassium",
    color: "var(--potassium)",
  },
  carbs: {
    label: "Carbohydrates",
    color: "var(--carbs)",
  },
  fiber: {
    label: "Fiber",
    color: "var(--fiber)",
  },
  sugar: {
    label: "Sugar",
    color: "var(--sugar)",
  },
  protein: {
    label: "Protein",
    color: "var(--protein)",
  },
  vitamin_a: {
    label: "Vitamin A",
    color: "var(--vitamin-a)",
  },
  vitamin_c: {
    label: "Vitamin C",
    color: "var(--vitamin-c)",
  },
  calcium: {
    label: "Calcium",
    color: "var(--calcium)",
  },
  iron: {
    label: "Iron",
    color: "var(--iron)",
  },
  added_sugars: {
    label: "Added Sugars",
    color: "var(--added-sugars)",
  },
  vitamin_d: {
    label: "Vitamin D",
    color: "var(--vitamin-d)",
  },
  sugar_alcohols: {
    label: "Sugar Alcohols",
    color: "var(--sugar-alcohols)",
  },
  empty: {
    label: "Sugar",
    color: "var(--chart-empty)",
  },
};

export enum MealCateogies {
  breakfast = "Breakfast",
  lunch = "Lunch",
  dinner = "Dinner",
  misc = "Misc",
}

export type Servings = {
  id: number;
  amount: number;
  unit: string;
  multiplier: number;
};
