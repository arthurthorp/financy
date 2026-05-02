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
import { TransactionForm, TransactionFormData } from "../TransactionForm";
import { toast } from "sonner";
import { apolloClient } from "@/lib/graphql/apollo";
import { useQueryClient } from "@tanstack/react-query";

import { CREATE_TRANSACTION } from "@/lib/graphql/mutations/CreateTransaction";
import { CreateTransactionInput } from "@/types";
import { reaisToCents } from "@/utils/currency";

type Props = {
  variant?: "default" | "ghost";
  categories: {
    id: string;
    title: string;
  }[];
};

export function CreateTransactionModal({
  categories,
  variant = "default",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (data: TransactionFormData) => {
    setLoading(true);
    console.log(data);
    try {
      await apolloClient.mutate<unknown, { data: CreateTransactionInput }>({
        mutation: CREATE_TRANSACTION,
        variables: {
          data: {
            type: data.type,
            description: data.description,
            date: data.date,
            amountInCents: reaisToCents(data.amount),
            categoryId: data.categoryId,
          },
        },
      });

      toast.success("Transação criada com sucesso!");

      setOpen(false);

      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["recent_transactions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar transação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "default" ? (
          <Button className="h-9 px-3 py-2.5">
            <PlusIcon />
            <span>Nova transação</span>
          </Button>
        ) : (
          <Button variant="ghost" className="gap-2 text-primary ">
            <PlusIcon className="w-4 h-4" />
            Nova transação
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova transação</DialogTitle>
          <DialogDescription>Registre sua despesa ou receita</DialogDescription>
        </DialogHeader>

        <TransactionForm
          categories={categories}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}
