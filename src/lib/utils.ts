import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ewma(data: number[], alpha: number): number[] {
  const result: number[] = [];
  let prev = data[0];
  result.push(prev);

  for (let i = 1; i < data.length; i++) {
    const current = alpha * data[i] + (1 - alpha) * prev;
    //rounding is not necessary for the EMWA, however it is done to get rid of unneeded data
    result.push(Math.round(current * 10) / 10);
    prev = current;
  }

  return result;
}

export function lerp(data: (number | null)[]): number[] {
  const result = [...data];

  const n = result.length;
  let start = -1;

  for (let i = 0; i < n; i++) {
    if (result[i] !== null) {
      start = i;
    } else if (start !== -1) {
      let end = i;
      while (end < n && result[end] === null) {
        end++;
      }

      if (end < n) {
        const x0 = start,
          y0 = result[start] as number;
        const x1 = end,
          y1 = result[end] as number;

        for (let j = x0 + 1; j < x1; j++) {
          result[j] =
            //rounding is not necessary for the lerp, however it is done to get rid of unneeded data
            Math.round((y0 + ((y1 - y0) * (j - x0)) / (x1 - x0)) * 10) / 10;
        }
      }
    }
  }

  return result as number[];
}

export function formatDateString(dateString: string | Date): string {
  const date = new Date(dateString);

  const year = date.toLocaleString("default", { year: "numeric" });
  const month = date.toLocaleString("default", { month: "2-digit" });
  const day = date.toLocaleString("default", { day: "2-digit" });

  // Generate yyyy-mm-dd date string
  return year + "-" + month + "-" + day;
}

export function imperialToMetric(
  feet: number,
  inches: number
): { meters: number; centimeters: number } {
  const meters = feet * 0.3048 + inches * 0.0254;
  const centimeters = meters * 100;

  return {
    meters: parseFloat(meters.toFixed(2)), // Round to 2 decimal places
    centimeters: parseFloat(centimeters.toFixed(2)),
  };
}

export function centimetersToImperial(centimeters: number): {
  feet: number;
  inches: number;
} {
  const totalMeters = centimeters / 100;
  const totalInches = totalMeters / 0.0254;
  const feet = Math.floor(totalInches / 12);
  const inches = parseFloat((totalInches % 12).toFixed(2));

  return {
    feet: feet,
    inches: inches,
  };
}
