export function FieldError({ message }: { message: string | undefined }) {
  if (!message) return <></>;
  return <span className="text-sm text-red-500 mt-1">{message}</span>;
}
