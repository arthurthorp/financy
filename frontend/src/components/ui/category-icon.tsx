import { getLightColor } from "@/utils/getLigthColor";
import { cn } from "@/lib/utils";
import { iconMap } from "@/lib/icons";

interface CategoryIconProps {
  color: string;
  icon: string;
  className?: string;
  iconClassName?: string;
}

export function CategoryIcon({
  color,
  icon,
  className,
  iconClassName,
}: CategoryIconProps) {
  const Icon = iconMap[icon];

  return (
    <div
      className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center",
        className
      )}
      style={{
        backgroundColor: getLightColor(color),
      }}
    >
      {Icon && (
        <Icon className={cn("w-4 h-4", iconClassName)} style={{ color }} />
      )}
    </div>
  );
}
