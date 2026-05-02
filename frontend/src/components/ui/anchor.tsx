import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type AnchorProps = {
  active?: boolean;
} & React.ComponentProps<typeof Link>;

export function Anchor({ className, active = false, ...props }: AnchorProps) {
  return (
    <Link
      className={cn(
        "text-primary",
        className,
        active ? "font-semibold text-primary" : "hover:underline"
      )}
      {...props}
    />
  );
}
