import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { LoginInput, RegisterInput } from "../dtos/input/auth.input";
import { LoginOutput, RegisterOutput } from "../dtos/output/auth.output";
import { AuthService } from "../services/auth.service";
import { User } from "@prisma/client";
import { GqlUser } from "../graphql/decorators/user.decorator";

@Resolver()
export class AuthResolver {
  private authService = new AuthService();

  @Mutation(() => LoginOutput)
  async login(
    @Arg("data", () => LoginInput) data: LoginInput
  ): Promise<LoginOutput> {
    return this.authService.login(data);
  }

  @Mutation(() => RegisterOutput)
  async register(
    @Arg("data", () => RegisterInput) data: RegisterInput
  ): Promise<RegisterOutput> {
    return this.authService.register(data);
  }

  @Mutation(() => LoginOutput)
  async refreshToken(
    @Arg("refreshToken", () => String) refreshToken: string
  ): Promise<LoginOutput> {
    return this.authService.refreshToken(refreshToken);
  }

  @Mutation(() => Boolean)
  async logout(@GqlUser() user: User): Promise<boolean> {
    return this.authService.logout(user.id);
  }
}
