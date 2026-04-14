import { Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../middlewares/auth.middleware";

@Resolver()
@UseMiddleware(isAuth)
export class CategoryResolver {
  @Query(() => String)
  listCategories(): string {
    return "Hello";
  }
}
