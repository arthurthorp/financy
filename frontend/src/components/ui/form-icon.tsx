import * as React from "react";
import { cn } from "@/lib/utils";

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type FormIconProps = {
  icon: IconType;
  hasError?: boolean;
  className?: string;
};

export function FormIcon({ icon: Icon, hasError, className }: FormIconProps) {
  console.log("FormIcon renderizado", { hasError, className });
  return (
    <Icon
      className={cn(
        "w-4 h-4 text-gray-400 transition-colors",
        className,
        hasError ? "text-destructive" : "group-focus-within:text-primary"
      )}
    />
  );
}
