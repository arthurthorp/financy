import { Arg, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { User } from "@prisma/client";
import { GqlUser } from "../graphql/decorators/user.decorator";
import { UserModel } from "../models/user.model";
import { UpdateUserInput } from "../dtos/input/user.input";
import { isAuth } from "../middlewares/auth.middleware";
import { UserService } from "../services/user.service";

@Resolver()
@UseMiddleware(isAuth)
export class UserResolver {
  private userService = new UserService();

  @Mutation(() => UserModel)
  async login(
    @Arg("data", () => UpdateUserInput) data: UpdateUserInput,
    @GqlUser() user: User
  ): Promise<UserModel> {
    return this.userService.update(data, user.id);
  }
}
