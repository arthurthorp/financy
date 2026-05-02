import { ColumnDef } from "@tanstack/react-table";
import { Category, Transaction } from "@/types";
import { centsToReais } from "@/utils/currency";
import { ColorBadge } from "@/components/ui/color-badge";
import { CircleArrowDownIcon, CircleArrowUpIcon } from "lucide-react";
import { CategoryIcon } from "@/components/ui/category-icon";

export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    id: "recents",
    header: "Transações recentes",
    cell: ({ row }) => (
      <div className="flex items-center gap-4 text-gray-800 text-base font-medium">
        <CategoryIcon
          color={row.original.category.color}
          icon={row.original.category.icon}
        />
        <span>{row.original.description}</span>
      </div>
    ),
  },

  {
    header: "Categoria",
    cell: ({ row }) => (
      <div className="flex items-center justify-end">
        <ColorBadge color={row.original.category.color}>
          {row.original.category.title}
        </ColorBadge>
      </div>
    ),
  },

  {
    id: "seeAll",
    header: "Valor",
    cell: ({ row }) => {
      const isExpense = row.original.type === "EXPENSE";

      return (
        <div className="flex justify-end items-center gap-2 font-semibold text-sm text-gray-800">
          <span>
            {isExpense ? "-" : "+"}
            {centsToReais(row.original.amountInCents)}
          </span>

          {isExpense ? (
            <CircleArrowDownIcon className="text-destructive w-4 h-4" />
          ) : (
            <CircleArrowUpIcon className="text-primary w-4 h-4" />
          )}
        </div>
      );
    },
  },
];

export const categoryColumns: ColumnDef<Category>[] = [
  {
    id: "title",
    header: "Categorias",
    cell: ({ row }) => (
      <div className="flex items-center gap-4 text-gray-800 text-base font-medium">
        <ColorBadge color={row.original.color}>{row.original.title}</ColorBadge>
      </div>
    ),
  },
  {
    header: "Itens",
    cell: ({ row }) => {
      const categoryItems = row.original.transactionsSummary.count ?? 0;

      return (
        <span className="text-xs text-muted-foreground">
          {categoryItems === 1
            ? `${categoryItems} item`
            : `${categoryItems} itens`}
        </span>
      );
    },
  },
  {
    header: "Total",
    cell: ({ row }) => {
      const total = row.original.transactionsSummary.totalAmountInCents ?? 0;

      return (
        <span className="text-sm text-gray-800 font-semibold">
          {centsToReais(total)}
        </span>
      );
    },
  },
];
