import { useForm, useWatch } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormGroup } from "@/components/ui/form-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { cn } from "@/lib/utils";
import { iconMap } from "@/lib/icons";
import { InputGroup } from "@/components/ui/input-group";
import { FieldDescription } from "@/components/ui/field";
import { colors } from "@/lib/colors";

const categorySchema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  description: z.string().optional(),
  icon: z.string().min(1, "Selecione um ícone"),
  color: z.string().min(1, "Selecione uma cor"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

type Props = {
  defaultValues?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => Promise<void> | void;
  loading?: boolean;
};

export function CategoryForm({ defaultValues, onSubmit, loading }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: "",
      description: "",
      icon: "",
      color: "",
      ...defaultValues,
    },
  });

  const selectedIcon = useWatch({ control, name: "icon" });
  const selectedColor = useWatch({ control, name: "color" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormGroup>
        <Label hasError={!!errors.title}>Título</Label>
        <InputGroup>
          <Input
            placeholder="Ex. Alimentação"
            {...register("title")}
            disabled={loading}
          />
        </InputGroup>
        <FieldError message={errors.title?.message} />
      </FormGroup>

      <FormGroup>
        <Label>Descrição</Label>
        <InputGroup>
          <Input
            placeholder="Descrição da categoria"
            {...register("description")}
            disabled={loading}
          />
        </InputGroup>
        <FieldDescription>Opcional</FieldDescription>
      </FormGroup>

      <div>
        <Label hasError={!!errors.icon}>Ícone</Label>

        <div className="grid grid-cols-8 gap-2">
          {Object.entries(iconMap).map(([key, Icon]) => {
            return (
              <button
                type="button"
                key={key}
                onClick={() => setValue("icon", key)}
                className={cn(
                  "w-10.5 cursor-pointer h-10.5 rounded-lg border border-gray-500 flex items-center justify-center",
                  selectedIcon === key && "border-primary bg-gray-100"
                )}
              >
                <Icon className="w-4 h-4 text-gray-600" />
              </button>
            );
          })}
        </div>

        <FieldError message={errors.icon?.message} />
      </div>

      <div>
        <Label hasError={!!errors.color}>Cor</Label>

        <div className="flex gap-2 flex-wrap">
          {colors.map((color) => (
            <button
              type="button"
              key={color}
              onClick={() => setValue("color", color)}
              className={cn(
                "w-12.5 h-7.5 cursor-pointer flex items-center justify-center rounded-lg border border-gray-300",
                selectedColor === color && "border-primary bg-gray-100"
              )}
            >
              <span
                className="w-10 h-5 rounded-sm"
                style={{ backgroundColor: color }}
              ></span>
            </button>
          ))}
        </div>

        <FieldError message={errors.color?.message} />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        Salvar
      </Button>
    </form>
  );
}
