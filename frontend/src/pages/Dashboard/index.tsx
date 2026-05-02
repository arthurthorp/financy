import { StatsCard } from "@/components/ui/stats-card";
import { useDashboard } from "@/hooks/useDashboard";
import { centsToReais } from "@/utils/currency";
import {
  categoryColumns,
  transactionColumns,
} from "./components/tables/columns";
import {
  CircleArrowDownIcon,
  CircleArrowUpIcon,
  WalletIcon,
} from "lucide-react";
import { RecentTransactionsTable } from "./components/tables/RecentTransactionsTable";
import { useRecentTransactions } from "@/hooks/useRecentTransactions";
import { useNavigate } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { CategoriesTable } from "./components/tables/CategoriesTable";

export function Dashboard() {
  const { data } = useDashboard();
  const navigate = useNavigate();
  const { data: recentTransactions } = useRecentTransactions();
  const { data: categories } = useCategories();

  const handleSeeAllTransactions = () => {
    navigate("/transactions");
  };

  const handleSeeAllCategories = () => {
    navigate("/categories");
  };

  if (!data) return null;

  return (
    <section className="mt-8 flex flex-col lg:grid lg:grid-cols-3 gap-6 items-center items-stretch">
      <StatsCard
        title="Saldo total"
        value={centsToReais(data.totalBalanceInCents)}
        icon={<WalletIcon className="text-chart-2" />}
      />

      <StatsCard
        title="Receitas do mês"
        value={centsToReais(data.monthRevenueInCents)}
        icon={<CircleArrowUpIcon className="text-primary" />}
      />

      <StatsCard
        title="Despesas do mês"
        value={centsToReais(data.monthExpensesInCents)}
        icon={<CircleArrowDownIcon className="text-destructive" />}
      />

      <div className="w-full col-span-2">
        <RecentTransactionsTable
          columns={transactionColumns}
          data={recentTransactions ?? []}
          categories={categories ?? []}
          onSeeAll={handleSeeAllTransactions}
        />
      </div>
      <div className="w-full">
        <CategoriesTable
          columns={categoryColumns}
          data={categories ?? []}
          onSeeAll={handleSeeAllCategories}
        />
      </div>
    </section>
  );
}
