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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

import { Button } from "@/components/ui/button";
import { Transaction } from "@/types";

import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  data: {
    data: Transaction[];
    total: number;
    totalPages: number;
    currentPage: number;
  };
  limit: number;
  columns: ColumnDef<Transaction>[];
  onPageChange: (page: number) => void;
};

export function TransactionsTable({
  data,
  columns,
  onPageChange,
  limit = 10,
}: Props) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  const currentPage = data.currentPage;
  const totalPages = data.totalPages;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const start = data.total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, data.total);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden bg-white rounded-md border mt-8">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`${
                      header.column.id === "actions" ? "text-right!" : ""
                    } ${
                      header.column.id === "description" ? "text-left!" : ""
                    } text-gray-500 uppercase text-xs py-5 px-6`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {data.data.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className={`${
                        cell.column.id === "description" ? "w-full" : ""
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
          <TableFooter className="w-full h-18 bg-white">
            <TableRow>
              <TableCell className="px-6 py-4">
                {start} a {end} | {data.total} resultados
              </TableCell>
              <TableCell className="px-6 py-4"></TableCell>
              <TableCell className="px-6 py-4"></TableCell>
              <TableCell className="px-6 py-4"></TableCell>
              <TableCell className="px-6 py-4"></TableCell>
              <TableCell className="px-6 py-4">
                <Pagination className="justify-end">
                  <PaginationContent>
                    <PaginationItem>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                    </PaginationItem>

                    {pages.map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => onPageChange(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
