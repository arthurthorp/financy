import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Variant = "default" | "compact";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  variant?: Variant;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  variant = "default",
  className,
}: StatsCardProps) {
  const isCompact = variant === "compact";

  return (
    <Card className={cn("rounded-lg max-w-95 w-full p-6", className)}>
      <CardContent className="flex gap-5">
        {isCompact ? (
          <>
            {Icon}
            <div className="flex flex-col gap-3 items-start">
              <span className="-mt-1 text-[28px] font-bold leading-none">
                {value}
              </span>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {title}
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              {Icon}
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {title}
              </span>
            </div>
            <span className="text-[28px] font-bold">{value}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
