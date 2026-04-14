import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class DashboardOutput {
  @Field(() => Number)
  totalBalanceInCents!: number;

  @Field(() => Number)
  monthRevenueInCents!: number;

  @Field(() => Number)
  monthExpensesInCents!: number;
}
