import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** junta classes do Tailwind sem conflito (padrão shadcn) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
