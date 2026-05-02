import { colorMap } from "@/lib/colors";

export function getLightColor(color: string): string {
  const normalized = color.toLowerCase();

  return colorMap[normalized] || normalized;
}
