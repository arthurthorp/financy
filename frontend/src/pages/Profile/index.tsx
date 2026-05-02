import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormGroup } from "@/components/ui/form-group";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { LogOutIcon, MailIcon, UserRoundIcon } from "lucide-react";
import { FieldError } from "@/components/ui/field-error";

import { FieldDescription } from "@/components/ui/field";
import { FormIcon } from "@/components/ui/form-icon";
import { getInitials } from "@/utils/getInitials";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const updateUserSchema = z.object({
  name: z.string().min(2, { message: "Nome inválido" }),
});

type UpdateUserForm = z.infer<typeof updateUserSchema>;

export function Profile() {
  const [loading, setLoading] = useState(false);
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: { name: user?.name || "" },
  });

  const onSubmit = async (data: UpdateUserForm) => {
    setLoading(true);
    try {
      const updateUserMutate = await updateUser({ name: data.name });
      if (updateUserMutate) {
        toast.success("Dados atualizados com sucesso!");
        return;
      }

      toast.error("Falha ao atualizar os dados!");
    } catch {
      toast.error("Falha ao atualizar os dados!");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center pt-8 justify-start gap-8">
      <Card className="w-full max-w-md rounded-xl">
        <CardHeader>
          <Avatar className="mx-auto w-16 h-16 ">
            <AvatarFallback className="bg-gray-300 text-gray-800 font-medium text-xl">
              {getInitials(user?.name || "")}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl font-bold text-center">
            {user?.name || ""}
          </CardTitle>
          <CardDescription className="text-center">
            {user?.email || ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormGroup>
              <Label hasError={!!errors.name?.message} htmlFor="name">
                Nome completo
              </Label>
              <InputGroup>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  {...register("name")}
                  disabled={loading}
                />
                <InputGroupAddon align="inline-start">
                  <FormIcon
                    icon={UserRoundIcon}
                    hasError={!!errors.name?.message}
                  />
                </InputGroupAddon>
              </InputGroup>

              <FieldError message={errors.name?.message} />
            </FormGroup>
            <FormGroup>
              <Label>E-mail</Label>
              <InputGroup>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  placeholder="mail@exemplo.com"
                  disabled
                />

                <InputGroupAddon align="inline-start">
                  <FormIcon icon={MailIcon} />
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                O e-mail não pode ser alterado
              </FieldDescription>
            </FormGroup>

            <Button type="submit" className="w-full" disabled={loading}>
              Salvar alterações
            </Button>
          </form>

          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={handleLogout}
          >
            <LogOutIcon className="text-destructive" />
            Sair da conta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
