import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export function Anchor({
  className,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn("text-blue-500 hover:underline", className)}
      {...props}
    />
  );
}
