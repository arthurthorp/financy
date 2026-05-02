import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CategoryForm, CategoryFormData } from "../CategoryForm";
import { toast } from "sonner";
import { apolloClient } from "@/lib/graphql/apollo";
import { CreateCategoryInput } from "@/types";
import { CREATE_CATEGORY } from "@/lib/graphql/mutations/CreateCategory";
import { useQueryClient } from "@tanstack/react-query";

export function CreateCategoryModal() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    const { title, description, icon, color } = data;

    try {
      await apolloClient.mutate<
        CreateCategoryInput,
        { data: CreateCategoryInput }
      >({
        mutation: CREATE_CATEGORY,
        variables: {
          data: { title, description, icon, color },
        },
      });

      toast.success("Categoria criada com sucesso!");

      setOpen(false);

      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    } catch {
      toast.error("Erro ao criar categoria");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-9 px-3 py-2.5">
          <PlusIcon />
          <span>Nova categoria</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova categoria</DialogTitle>
          <DialogDescription>
            Organize suas transações com categorias
          </DialogDescription>
        </DialogHeader>

        <CategoryForm onSubmit={handleSubmit} loading={loading} />
      </DialogContent>
    </Dialog>
  );
}
