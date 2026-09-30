import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tiện ích gộp class Tailwind an toàn tránh xung đột CSS
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
