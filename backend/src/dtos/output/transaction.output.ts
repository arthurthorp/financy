import { Field, ObjectType } from "type-graphql";
import { TransactionModel } from "../../models/transaction.model";

@ObjectType()
export class PaginatedTransactionsOutput {
  @Field(() => [TransactionModel])
  data: TransactionModel[];

  @Field(() => Number)
  total: number;

  @Field(() => Number)
  totalPages: number;

  @Field(() => Number)
  currentPage: number;
}
