import { Badge } from "@/components/ui/badge";
import { colorMap } from "@/lib/colors";
import { cn } from "@/lib/utils";

interface ColorBadgeProps {
  color: string;
  children: React.ReactNode;
  className?: string;
}

export function ColorBadge({ color, children, className }: ColorBadgeProps) {
  const bgColor = colorMap[color] || color + "20";

  return (
    <Badge
      className={cn("border-0 h-7 py-1 px-3 font-medium", className)}
      style={{
        backgroundColor: bgColor,
        color: color,
      }}
    >
      {children}
    </Badge>
  );
}
