import { PageTitle } from "@/components/PageTitle";
import { CreateTransactionModal } from "./components/modals/CreateTransactionModal";
import { useCategories } from "@/hooks/useCategories";
import {
  TransactionFiltersForm,
  TransactionFiltersFormData,
} from "./components/TransactionFilterForm";
import { useMemo, useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionsTable } from "./components/table/TransactionTable";
import { columns } from "./components/table/columns";

export function Transactions() {
  const limit = 10;
  const [filters, setFilters] = useState<TransactionFiltersFormData>({});
  const [page, setPage] = useState(1);
  const { data: categories } = useCategories();

  const normalizedFilters = useMemo(() => {
    return {
      categoryId: filters.categoryId,
      description: filters.description,
      type: filters.type,
      month: filters.period ? Number(filters.period.split("-")[1]) : undefined,
      year: filters.period ? Number(filters.period.split("-")[0]) : undefined,
    };
  }, [filters]);

  const { data } = useTransactions({
    page,
    limit,
    filters: normalizedFilters,
  });

  const handleFiltersChange = (data: TransactionFiltersFormData) => {
    setFilters(data);
    setPage(1);
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  return (
    <section>
      <div className="flex gap-2 flex-col md:flex-row md:items-center md:justify-between">
        <PageTitle
          title="Transações"
          subtitle="Gerencie todas as suas transações financeiras"
        />

        <CreateTransactionModal categories={categories ?? []} />
      </div>
      <TransactionFiltersForm
        categories={categories ?? []}
        onChange={handleFiltersChange}
      />
      {data && (
        <TransactionsTable
          limit={limit}
          columns={columns}
          data={data}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  );
}
