import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class DashboardOutput {
  @Field(() => Int)
  totalBalanceInCents!: number;

  @Field(() => Int)
  monthRevenueInCents!: number;

  @Field(() => Int)
  monthExpensesInCents!: number;
}
