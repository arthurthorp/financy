import { Query, Resolver, UseMiddleware } from "type-graphql";
import { User } from "@prisma/client";
import { GqlUser } from "../graphql/decorators/user.decorator";
import { isAuth } from "../middlewares/auth.middleware";
import { TransactionService } from "../services/transaction.service";
import { DashboardOutput } from "../dtos/output/dashboard.output";

@Resolver()
@UseMiddleware(isAuth)
export class DashboardResolver {
  private transactionService = new TransactionService();

  @Query(() => DashboardOutput)
  homeDashboard(@GqlUser() user: User): Promise<DashboardOutput> {
    return this.transactionService.transactionsResume(user.id);
  }
}
