import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "@/types";
import { centsToReais } from "@/utils/currency";
import { ColorBadge } from "@/components/ui/color-badge";
import { CircleArrowDownIcon, CircleArrowUpIcon } from "lucide-react";
import { CategoryIcon } from "@/components/ui/category-icon";
import { TransactionActions } from "../TransactionActions";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => (
      <span className="flex gap-4 items-center text-gray-800 text-base font-medium">
        <CategoryIcon
          color={row.original.category.color}
          icon={row.original.category.icon}
        />
        {row.original.description}
      </span>
    ),
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) => (
      <span className="text-gray-600 text-sm">
        {new Date(row.original.date).toLocaleDateString("pt-BR")}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row }) => (
      <ColorBadge color={row.original.category.color}>
        {row.original.category.title}
      </ColorBadge>
    ),
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) =>
      row.original.type === "EXPENSE" ? (
        <span className="flex items-center gap-2 text-destructive">
          <CircleArrowDownIcon /> Despesa
        </span>
      ) : (
        <span className="flex items-center gap-2 text-primary">
          <CircleArrowUpIcon /> Entrada
        </span>
      ),
  },
  {
    accessorKey: "amountInCents",
    header: "Valor",
    cell: ({ row }) => (
      <span className="font-semibold text-sm text-gray-800">{`${
        row.original.type === "EXPENSE" ? "-" : "+"
      }${centsToReais(row.original.amountInCents)}`}</span>
    ),
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => <TransactionActions transaction={row.original} />,
  },
];
