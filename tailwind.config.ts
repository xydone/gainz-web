import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "var(--foreground)",
        text: {
          DEFAULT: "var(--text-color)",
          muted: "var(--muted-text-color)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          strong: "var(--accent-strong)",
          foreground: "var(--accent-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          empty: "var(--chart-empty)",
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        nutrients: {
          calories: "var(--calories)",
          fat: "var(--fat)",
          sat_fat: "var(--sat_fat)",
          polyunsat_fat: "var(--polyunsat_fat)",
          monounsat_fat: "var(--monounsat_fat)",
          trans_fat: "var(--trans_fat)",
          cholesterol: "var(--cholesterol)",
          sodium: "var(--sodium)",
          potassium: "var(--potassium)",
          carbs: "var(--carbs)",
          fiber: "var(--fiber)",
          sugar: "var(--sugar)",
          protein: "var(--protein)",
          vitamin_a: "var(--vitamin_a)",
          vitamin_c: "var(--vitamin_c)",
          calcium: "var(--calcium)",
          iron: "var(--iron)",
          added_sugars: "var(--added_sugars)",
          vitamin_d: "var(--vitamin_d)",
          sugar_alcohols: "var(--sugar_alcohols)",
        },
        weight: {
          scale: "var(--weight-scale)",
          estimated: "var(--weight-estimated)",
        },
        goal: "var(--goal)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
