import { cn } from "@/lib/utils";

export function FormGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("group w-full", className)} {...props} />;
}
