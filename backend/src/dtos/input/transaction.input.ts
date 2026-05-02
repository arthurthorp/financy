import { Field, InputType } from "type-graphql";
import { IsEnum, IsInt, IsNotEmpty, IsUUID, Matches } from "class-validator";
import { TransactionType } from "@prisma/client";

@InputType()
export class CreateTransactionInput {
  @Field(() => TransactionType)
  @IsEnum(TransactionType)
  type!: TransactionType;

  @Field(() => String)
  @IsNotEmpty({ message: "Description is required" })
  description!: string;

  @Field(() => Number)
  @IsInt()
  amountInCents!: number;

  @Field(() => String)
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Date must be in format YYYY-MM-DD",
  })
  date!: string;

  @Field(() => String)
  @IsUUID()
  categoryId!: string;
}

@InputType()
export class PaginatedTransactionsInput {
  @Field(() => Number, { defaultValue: 1 })
  page: number;

  @Field(() => Number, { defaultValue: 10 })
  limit: number;
}

@InputType()
export class ListTransactionsInput extends PaginatedTransactionsInput {
  @Field(() => TransactionFiltersInput, { nullable: true })
  filters?: TransactionFiltersInput;
}

@InputType()
export class TransactionFiltersInput {
  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  type?: "income" | "expense";

  @Field(() => String, { nullable: true })
  categoryId?: string;

  @Field(() => Number, { nullable: true })
  month?: number;

  @Field(() => Number, { nullable: true })
  year?: number;
}
