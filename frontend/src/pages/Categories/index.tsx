import { PageTitle } from "@/components/PageTitle";
import { CreateCategoryModal } from "./components/modals/CreateCategoryModal";
import { useCategories } from "@/hooks/useCategories";
import { CategoryItem } from "./components/CategoryItem";
import { StatsCard } from "@/components/ui/stats-card";
import { ArrowUpDownIcon, TagIcon } from "lucide-react";
import { getMostUsedCategory } from "@/utils/getMostCategoryUsed";
import { iconMap } from "@/lib/icons";

export function Categories() {
  const { data, isLoading } = useCategories();

  const categoryMostUsed = getMostUsedCategory(data ?? []);

  const Icon = categoryMostUsed ? iconMap[categoryMostUsed.icon] : null;

  return (
    <section>
      <div className="flex flex-col-reverse md:flex-row items-center justify-between">
        <PageTitle
          title="Categorias"
          subtitle="Organize suas transações por categorias"
        />

        <CreateCategoryModal />
      </div>

      {!isLoading && data && (
        <>
          <div className="mt-8 flex flex-wrap gap-6 items-center">
            <StatsCard
              variant="compact"
              title="Total de Categorias"
              value={data.length}
              icon={<TagIcon className="text-gray-700" />}
            />

            <StatsCard
              variant="compact"
              title="Total de Transações"
              value={data.reduce(
                (acc, category) => acc + (category.countTransactions ?? 0),
                0
              )}
              icon={<ArrowUpDownIcon className="text-chart-2" />}
            />

            <StatsCard
              variant="compact"
              title="Categoria mais utilizada"
              value={categoryMostUsed.title}
              icon={
                Icon ? (
                  <Icon style={{ color: categoryMostUsed.color }} />
                ) : undefined
              }
            />
          </div>
          <div className="flex flex-wrap gap-4 mt-8">
            {data.map((category) => (
              <CategoryItem key={category.id} category={category} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
