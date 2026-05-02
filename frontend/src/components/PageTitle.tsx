export function PageTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <h2 className="text-gray-600">{subtitle}</h2>
    </div>
  );
}
