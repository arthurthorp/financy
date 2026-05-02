import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../middlewares/auth.middleware";
import { User } from "@prisma/client";
import { GqlUser } from "../graphql/decorators/user.decorator";
import { TransactionService } from "../services/transaction.service";
import { TransactionModel } from "../models/transaction.model";
import {
  CreateTransactionInput,
  ListTransactionsInput,
} from "../dtos/input/transaction.input";
import { CategoryModel } from "../models/category.model";
import { CategoryService } from "../services/category.service";
import { PaginatedTransactionsOutput } from "../dtos/output/transaction.output";

@Resolver(() => TransactionModel)
@UseMiddleware(isAuth)
export class TransactionResolver {
  private transactionService = new TransactionService();
  private categoryService = new CategoryService();

  @Query(() => PaginatedTransactionsOutput)
  listTransactions(
    @Arg("input", () => ListTransactionsInput)
    input: ListTransactionsInput,
    @GqlUser() user: User
  ): Promise<PaginatedTransactionsOutput> {
    return this.transactionService.listByUserId(input, user.id);
  }

  @Query(() => [TransactionModel])
  listRecentsTransactions(@GqlUser() user: User): Promise<TransactionModel[]> {
    return this.transactionService.listRecentsByUserId(user.id);
  }

  @Mutation(() => TransactionModel)
  async createTransaction(
    @Arg("data", () => CreateTransactionInput) data: CreateTransactionInput,
    @GqlUser() user: User
  ): Promise<TransactionModel> {
    return this.transactionService.create(data, user.id);
  }

  @Mutation(() => TransactionModel)
  async updateTransaction(
    @Arg("data", () => CreateTransactionInput) data: CreateTransactionInput,
    @Arg("id", () => String) id: string,
    @GqlUser() user: User
  ): Promise<TransactionModel> {
    return this.transactionService.update(data, id, user.id);
  }

  @Mutation(() => Boolean)
  async deleteTransaction(
    @Arg("id", () => String) id: string,
    @GqlUser() user: User
  ): Promise<boolean> {
    await this.transactionService.delete(id, user.id);

    return true;
  }

  @FieldResolver(() => CategoryModel)
  async category(
    @Root() transaction: TransactionModel
  ): Promise<CategoryModel> {
    return this.categoryService.getCategoryById(transaction.categoryId);
  }
}
