import { useCallback, useMemo, useState } from "react";
import { EntityActions } from "@/components/EntityActions";
import { Transaction } from "@/types";
import { TransactionForm, TransactionFormData } from "./TransactionForm";
import { useCategories } from "@/hooks/useCategories";
import { centsToReais, reaisToCents } from "@/utils/currency";
import { apolloClient } from "@/lib/graphql/apollo";
import { UPDATE_TRANSACTION } from "@/lib/graphql/mutations/UpdateTransaction";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { DELETE_TRANSACTION } from "@/lib/graphql/mutations/DeleteTransaction";
import { toLocalDateInput } from "@/utils/toLocalDateInput";

type Props = {
  transaction: Transaction;
};

export function TransactionActions({ transaction }: Props) {
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data } = useCategories();
  const queryClient = useQueryClient();

  const handleUpdate = useCallback(
    async (form: TransactionFormData) => {
      setLoading(true);

      try {
        await apolloClient.mutate({
          mutation: UPDATE_TRANSACTION,
          variables: {
            data: {
              type: form.type,
              description: form.description,
              date: form.date,
              amountInCents: reaisToCents(form.amount),
              categoryId: form.categoryId,
            },
            updateTransactionId: transaction.id,
          },
        });

        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });

        setOpenEdit(false);
      } catch {
        toast.error("Erro ao atualizar transação");
      } finally {
        setLoading(false);
      }
    },
    [transaction.id, queryClient]
  );

  const handleDelete = useCallback(async () => {
    try {
      await apolloClient.mutate({
        mutation: DELETE_TRANSACTION,
        variables: {
          deleteTransactionId: transaction.id,
        },
      });

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      toast.success("Transação removida com sucesso!");
    } catch {
      toast.error("Erro ao remover transação");
    }
  }, [transaction.id, queryClient]);

  const editContent = useMemo(() => {
    return (
      <TransactionForm
        loading={loading}
        onSubmit={handleUpdate}
        categories={data}
        defaultValues={{
          categoryId: transaction.category.id,
          amount: centsToReais(transaction.amountInCents),
          description: transaction.description,
          date: toLocalDateInput(transaction.date),
          type: transaction.type,
        }}
      />
    );
  }, [loading, handleUpdate, data, transaction]);

  if (!data) return null;

  return (
    <EntityActions
      openEdit={openEdit}
      setOpenEdit={setOpenEdit}
      onDelete={handleDelete}
      className="justify-end"
      editContent={editContent}
      editTitle="Editar transação"
      deleteTitle="Excluir transação?"
      deleteDescription="Essa ação removerá a transação permanentemente."
    />
  );
}
