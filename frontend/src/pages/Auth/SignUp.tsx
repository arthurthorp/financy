import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.svg";
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
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormGroup } from "@/components/ui/form-group";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import {
  EyeClosedIcon,
  EyeIcon,
  LockIcon,
  LogInIcon,
  MailIcon,
  UserRoundIcon,
} from "lucide-react";
import { FieldError } from "@/components/ui/field-error";
import { FieldDescription, FieldSeparator } from "@/components/ui/field";
import { FormIcon } from "@/components/ui/form-icon";

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Nome inválido" }),
  email: z.email({ message: "Email inválido" }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export function SignUp() {
  const [loading, setLoading] = useState(false);
  const signup = useAuthStore((state) => state.signup);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (data: SignUpForm) => {
    setLoading(true);
    try {
      const loginMutate = await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      if (loginMutate) {
        toast.success("Cadastro realizado com sucesso!");
        navigate("/");
      }
    } catch {
      toast.error("Falha ao realizar o cadastro!");
    } finally {
      setLoading(false);
    }
  };

  const tooglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center py-8 justify-start gap-8">
      <img src={logo} className="h-8" />
      <Card className="w-full max-w-md rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">
            Criar conta
          </CardTitle>
          <CardDescription className="text-center">
            Comece a controlar suas finanças ainda hoje
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
              <Label hasError={!!errors.email?.message} htmlFor="email">
                Email
              </Label>
              <InputGroup>
                <Input
                  id="email"
                  type="email"
                  placeholder="mail@exemplo.com"
                  {...register("email")}
                  disabled={loading}
                />
                <InputGroupAddon align="inline-start">
                  <FormIcon
                    icon={MailIcon}
                    hasError={!!errors.email?.message}
                  />
                </InputGroupAddon>
              </InputGroup>

              <FieldError message={errors.email?.message} />
            </FormGroup>
            <FormGroup>
              <Label hasError={!!errors.password?.message} htmlFor="password">
                Senha
              </Label>
              <InputGroup>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  {...register("password")}
                  disabled={loading}
                />

                <InputGroupAddon align="inline-start">
                  <FormIcon
                    icon={LockIcon}
                    hasError={!!errors.password?.message}
                  />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="sm"
                    variant="ghost"
                    className="ml-auto"
                    onClick={tooglePasswordVisibility}
                  >
                    {showPassword ? (
                      <FormIcon icon={EyeIcon} />
                    ) : (
                      <FormIcon icon={EyeClosedIcon} />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              {!errors.password?.message && (
                <FieldDescription>
                  A senha deve ter pelo menos 8 caracteres
                </FieldDescription>
              )}

              <FieldError message={errors.password?.message} />
            </FormGroup>

            <Button type="submit" className="w-full" disabled={loading}>
              Cadastrar
            </Button>
          </form>
          <FieldSeparator className="my-6">ou</FieldSeparator>

          <span className="text-gray-600 text-sm text-center block mb-4">
            Já tem uma conta?
          </span>

          <Button variant="outline" className="w-full" asChild>
            <Link className="flex items-center text-gray-700 gap-2" to="/login">
              <LogInIcon />
              Fazer login
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
