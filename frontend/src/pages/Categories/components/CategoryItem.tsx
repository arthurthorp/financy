import { Card, CardContent } from "@/components/ui/card";
import { ColorBadge } from "@/components/ui/color-badge";
import { CategoryIcon } from "@/components/ui/category-icon";
import { EntityActions } from "@/components/EntityActions";
import { CategoryForm } from "./CategoryForm";
import { toast } from "sonner";
import {
  Category,
  UpdateCategoryOutput,
  UpdateCategoryVariables,
} from "@/types";
import { apolloClient } from "@/lib/graphql/apollo";
import { UPDATE_CATEGORY } from "@/lib/graphql/mutations/UpdateCategory";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { DELETE_CATEGORY } from "@/lib/graphql/mutations/DeleteCategory";

interface CategoryItemProps {
  category: Category;
}

export function CategoryItem({ category }: CategoryItemProps) {
  const categoryItems = category.countTransactions ?? 0;
  const queryClient = useQueryClient();
  const [openEdit, setOpenEdit] = useState(false);

  const handleUpdate = async (data: Partial<Category>) => {
    const { title, description, icon, color } = data;

    try {
      await apolloClient.mutate<UpdateCategoryOutput, UpdateCategoryVariables>({
        mutation: UPDATE_CATEGORY,
        variables: {
          data: {
            title,
            description,
            icon,
            color,
          },
          updateCategoryId: category.id,
        },
      });

      toast.success("Categoria atualizada com sucesso!");

      setOpenEdit(false);

      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    } catch {
      toast.error("Erro ao atualizar categoria");
    }
  };

  const handleDelete = async () => {
    try {
      await apolloClient.mutate({
        mutation: DELETE_CATEGORY,
        variables: {
          deleteCategoryId: category.id,
        },
      });

      toast.success("Categoria removida com sucesso!");

      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    } catch {
      toast.error("Erro ao remover categoria");
    }
  };

  return (
    <Card className="w-[320px] rounded-xl">
      <CardContent className="p-4 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <CategoryIcon color={category.color} icon={category.icon} />

          <EntityActions
            deleteTitle="Excluir categoria"
            deleteDescription="Tem certeza que deseja excluir essa categoria? Essa ação não pode ser desfeita."
            openEdit={openEdit}
            setOpenEdit={setOpenEdit}
            editTitle="Editar categoria"
            editDescription="Faça as alterações desejadas e clique em salvar para atualizar a categoria."
            editContent={
              <CategoryForm onSubmit={handleUpdate} defaultValues={category} />
            }
            onDelete={handleDelete}
          />
        </div>

        <div>
          <p className="text-base font-semibold">{category.title}</p>
          <p className="text-sm text-muted-foreground">
            {category.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <ColorBadge color={category.color}>{category.title}</ColorBadge>

          <span className="text-xs text-muted-foreground">
            {categoryItems === 1
              ? `${categoryItems} item`
              : `${categoryItems} itens`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
