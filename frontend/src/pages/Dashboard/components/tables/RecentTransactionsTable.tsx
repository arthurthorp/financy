import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table";

import { Category, Transaction } from "@/types";

import { CreateTransactionModal } from "@/pages/Transactions/components/modals/CreateTransactionModal";
import { ChevronRightIcon } from "lucide-react";

type Props = {
  data: Transaction[];
  categories: Category[];
  columns: ColumnDef<Transaction>[];
  onSeeAll: () => void;
};

export function RecentTransactionsTable({
  data,
  columns,
  onSeeAll,
  categories,
}: Props) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="overflow-hidden bg-white rounded-md border">
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="text-gray-500 text-xs font-medium uppercase">
            Transações recentes
          </h2>

          <button
            onClick={onSeeAll}
            className="cursor-pointer text-sm text-primary font-medium flex items-center gap-1"
          >
            Ver todas
            <ChevronRightIcon className="text-primary" />
          </button>
        </div>

        <Table>
          <TableBody>
            {data.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className={`${
                        cell.column.id === "seeAll" ? "text-right!" : ""
                      } px-6 py-4`}
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhuma transação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="px-6 py-4 bg-white"
              >
                <div className="flex justify-center">
                  <CreateTransactionModal
                    categories={categories}
                    variant="ghost"
                  />
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
