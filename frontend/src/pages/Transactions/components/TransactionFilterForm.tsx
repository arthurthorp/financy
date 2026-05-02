import { useEffect, useMemo } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormGroup } from "@/components/ui/form-group";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { generateMonthYearOptions } from "@/utils/generateMonthYearOptions";
import { Card } from "@/components/ui/card";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";

const filterSchema = z.object({
  description: z.string().optional(),
  type: z.enum(["EXPENSE", "REVENUE"]).optional(),
  categoryId: z.string().optional(),
  period: z.string().optional(),
});

export type TransactionFiltersFormData = z.infer<typeof filterSchema>;

type Category = {
  id: string;
  title: string;
};

type Props = {
  categories: Category[];
  onChange: (data: TransactionFiltersFormData) => void;
};

function normalize(value?: string) {
  if (!value || value === "ALL") return undefined;
  return value;
}

export function TransactionFiltersForm({ categories, onChange }: Props) {
  const { register, control } = useForm<TransactionFiltersFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      description: "",
      type: undefined,
      categoryId: undefined,
      period: undefined,
    },
  });

  const periods = useMemo(() => generateMonthYearOptions(12), []);

  const values = useWatch({
    control,
    defaultValue: {
      description: "",
      type: undefined,
      categoryId: undefined,
      period: undefined,
    },
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      const payload: TransactionFiltersFormData = {
        description:
          values.description && values.description.length >= 3
            ? values.description
            : undefined,

        type: normalize(values.type) as "EXPENSE" | "REVENUE",
        categoryId: normalize(values.categoryId),
        period: normalize(values.period),
      };

      onChange(payload);
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.description, values.type, values.categoryId, values.period]);

  return (
    <Card className="w-full rounded-xl border py-5 px-6 mt-8">
      <div className="flex justify-between gap-4">
        {/* DESCRIÇÃO */}
        <FormGroup>
          <Label>Descrição</Label>
          <InputGroup>
            <Input
              placeholder="Buscar por descrição"
              {...register("description")}
            />
            <InputGroupAddon>
              <SearchIcon className="text-gray-400" />
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>

        {/* TYPE */}
        <FormGroup>
          <Label>Tipo</Label>

          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select
                value={field.value ?? "ALL"}
                onValueChange={(value) => field.onChange(normalize(value))}
              >
                <SelectTrigger className="w-full h-12!">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tipo</SelectLabel>
                    <SelectItem value="ALL">Todos</SelectItem>
                    <SelectItem value="EXPENSE">Despesa</SelectItem>
                    <SelectItem value="REVENUE">Receita</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </FormGroup>

        {/* CATEGORY */}
        <FormGroup>
          <Label>Categoria</Label>

          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select
                value={field.value ?? "ALL"}
                onValueChange={(value) => field.onChange(normalize(value))}
              >
                <SelectTrigger className="w-full h-12!">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categorias</SelectLabel>
                    <SelectItem value="ALL">Todas</SelectItem>

                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </FormGroup>

        {/* PERIOD */}
        <FormGroup>
          <Label>Período</Label>

          <Controller
            control={control}
            name="period"
            render={({ field }) => (
              <Select
                value={field.value ?? "ALL"}
                onValueChange={(value) => field.onChange(normalize(value))}
              >
                <SelectTrigger className="w-full h-12!">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Período</SelectLabel>
                    <SelectItem value="ALL">Todos</SelectItem>

                    {periods.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </FormGroup>
      </div>
    </Card>
  );
}
