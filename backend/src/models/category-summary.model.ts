import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
export class CategorySummaryModel {
  @Field(() => Int)
  count!: number;

  @Field(() => Int)
  totalAmountInCents!: number;
}
