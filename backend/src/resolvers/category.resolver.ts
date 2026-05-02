import {
  Arg,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../middlewares/auth.middleware";
import { User } from "@prisma/client";
import { GqlUser } from "../graphql/decorators/user.decorator";
import { CategoryService } from "../services/category.service";
import { CategoryModel } from "../models/category.model";
import { CreateCategoryInput } from "../dtos/input/category.input";
import { TransactionService } from "../services/transaction.service";
import { CategorySummaryModel } from "../models/category-summary.model";

@Resolver(() => CategoryModel)
@UseMiddleware(isAuth)
export class CategoryResolver {
  private categoryService = new CategoryService();
  private transactionService = new TransactionService();

  @Query(() => [CategoryModel])
  listCategories(@GqlUser() user: User): Promise<CategoryModel[]> {
    return this.categoryService.listByUserId(user.id);
  }

  @Mutation(() => CategoryModel)
  async createCategory(
    @Arg("data", () => CreateCategoryInput) data: CreateCategoryInput,
    @GqlUser() user: User
  ): Promise<CategoryModel> {
    return this.categoryService.create(data, user.id);
  }

  @Mutation(() => CategoryModel)
  async updateCategory(
    @Arg("data", () => CreateCategoryInput) data: CreateCategoryInput,
    @Arg("id", () => String) id: string,
    @GqlUser() user: User
  ): Promise<CategoryModel> {
    return this.categoryService.update(data, id, user.id);
  }

  @Mutation(() => Boolean)
  async deleteCategory(
    @Arg("id", () => String) id: string,
    @GqlUser() user: User
  ): Promise<boolean> {
    await this.categoryService.delete(id, user.id);

    return true;
  }

  @FieldResolver(() => CategorySummaryModel)
  async transactionsSummary(
    @Root() category: CategoryModel
  ): Promise<CategorySummaryModel> {
    const [count, sum] = await Promise.all([
      this.transactionService.countTransactionsByCategoryId(category.id),
      this.transactionService.sumAmountByCategoryId(category.id),
    ]);

    return {
      count,
      totalAmountInCents: sum,
    };
  }
}
