import { useForm, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormGroup } from "@/components/ui/form-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { cn } from "@/lib/utils";

import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { formatCurrencyInput } from "@/utils/currency";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const transactionSchema = z.object({
  type: z.enum(["EXPENSE", "REVENUE"]),
  description: z.string().min(1, "Descrição obrigatória"),
  date: z.string().min(1, "Selecione uma data"),
  amount: z.string().min(1, "Valor obrigatório"),
  categoryId: z.string().min(1, "Selecione uma categoria"),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

type Category = {
  id: string;
  title: string;
};

type Props = {
  categories: Category[];
  defaultValues?: Partial<TransactionFormData>;
  onSubmit: (data: TransactionFormData) => Promise<void> | void;
  loading?: boolean;
};

export function TransactionForm({
  categories,
  defaultValues,
  onSubmit,
  loading,
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "EXPENSE",
      description: "",
      date: "",
      amount: "",
      categoryId: "",
      ...defaultValues,
    },
  });

  const selectedType = useWatch({ control, name: "type" });

  const isExpense = selectedType === "EXPENSE";
  const isRevenue = selectedType === "REVENUE";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-2 border border-gray-200 p-2 rounded-xl">
        <button
          type="button"
          onClick={() => setValue("type", "EXPENSE")}
          className={cn(
            "flex cursor-pointer items-center justify-center gap-2 rounded-lg border p-3",
            isExpense
              ? "border-destructive text-gray-800 font-medium bg-destructive/5"
              : "border-transparent text-gray-600"
          )}
        >
          <ArrowDownCircle
            className={cn("w-4 h-4", isExpense && "text-destructive")}
          />
          Despesa
        </button>

        <button
          type="button"
          onClick={() => setValue("type", "REVENUE")}
          className={cn(
            "flex cursor-pointer items-center justify-center gap-2 rounded-lg border p-3",
            isRevenue
              ? "border-primary text-primary font-medium bg-primary/5"
              : "border-transparent text-gray-600"
          )}
        >
          <ArrowUpCircle
            className={cn("w-4 h-4", isRevenue && "text-primary")}
          />
          Receita
        </button>
      </div>

      <FormGroup>
        <Label hasError={!!errors.description}>Descrição</Label>
        <InputGroup>
          <Input
            placeholder="Ex. Almoço no restaurante"
            {...register("description")}
            disabled={loading}
          />
        </InputGroup>

        <FieldError message={errors.description?.message} />
      </FormGroup>

      <div className="grid grid-cols-2 gap-4">
        <FormGroup>
          <Label hasError={!!errors.date}>Data</Label>
          <InputGroup>
            <Input type="date" {...register("date")} disabled={loading} />
          </InputGroup>

          <FieldError message={errors.date?.message} />
        </FormGroup>

        <FormGroup>
          <Label hasError={!!errors.amount}>Valor</Label>
          <InputGroup>
            <InputGroupAddon>
              <span className="text-black">R$</span>
            </InputGroupAddon>
            <Input
              placeholder="R$ 0,00"
              {...register("amount")}
              disabled={loading}
              onChange={(e) => {
                const formatted = formatCurrencyInput(e.target.value);
                setValue("amount", formatted);
              }}
            />
          </InputGroup>
          <FieldError message={errors.amount?.message} />
        </FormGroup>
      </div>

      <FormGroup>
        <Label hasError={!!errors.categoryId}>Categoria</Label>

        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categorias</SelectLabel>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />

        <FieldError message={errors.categoryId?.message} />
      </FormGroup>

      <Button type="submit" className="w-full" disabled={loading}>
        Salvar
      </Button>
    </form>
  );
}
