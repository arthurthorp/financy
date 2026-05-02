import { prisma } from "../../prisma/prisma";
import {
  CreateTransactionInput,
  ListTransactionsInput,
} from "../dtos/input/transaction.input";
import { DashboardOutput } from "../dtos/output/dashboard.output";
import { PaginatedTransactionsOutput } from "../dtos/output/transaction.output";
import { TransactionModel } from "../models/transaction.model";
import { normalizeDate } from "../utils/normalizeDate";

export class TransactionService {
  async listByUserId(
    input: ListTransactionsInput,
    userId: string
  ): Promise<PaginatedTransactionsOutput> {
    const { page, limit, filters } = input;

    const skip = (page - 1) * limit;

    const where: any = {
      userId,
    };

    if (filters?.description) {
      where.description = {
        contains: filters.description,
      };
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.month || filters?.year) {
      const year = filters.year ?? new Date().getFullYear();
      const month = filters.month;

      const startDate = new Date(Date.UTC(year, (month ?? 1) - 1, 1));
      const endDate = month
        ? new Date(Date.UTC(year, month, 1))
        : new Date(Date.UTC(year + 1, 0, 1));

      where.date = {
        gte: startDate,
        lt: endDate,
      };
    }

    const [data, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { date: "desc" },
        skip,
        take: limit,
      }),
      prisma.transaction.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      totalPages,
      currentPage: page,
    };
  }

  async listRecentsByUserId(userId: string): Promise<TransactionModel[]> {
    return prisma.transaction.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: "desc",
      },
      take: 5,
    });
  }

  async sumAmountByCategoryId(categoryId: string): Promise<number> {
    const transactions = await prisma.transaction.findMany({
      where: { categoryId },
      select: {
        amountInCents: true,
        type: true,
      },
    });

    return transactions.reduce((acc, transaction) => {
      const value =
        transaction.type === "EXPENSE"
          ? -transaction.amountInCents
          : transaction.amountInCents;

      return acc + value;
    }, 0);
  }

  async transactionsResume(userId: string): Promise<DashboardOutput> {
    const now = new Date();

    const startOfMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0)
    );

    const endOfMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999)
    );

    const [totalRevenue, totalExpense, monthRevenue, monthExpense] =
      await Promise.all([
        prisma.transaction.aggregate({
          where: {
            userId,
            type: "REVENUE",
          },
          _sum: {
            amountInCents: true,
          },
        }),

        prisma.transaction.aggregate({
          where: {
            userId,
            type: "EXPENSE",
          },
          _sum: {
            amountInCents: true,
          },
        }),

        prisma.transaction.aggregate({
          where: {
            userId,
            type: "REVENUE",
            date: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
          _sum: {
            amountInCents: true,
          },
        }),

        prisma.transaction.aggregate({
          where: {
            userId,
            type: "EXPENSE",
            date: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
          _sum: {
            amountInCents: true,
          },
        }),
      ]);

    return {
      totalBalanceInCents:
        (totalRevenue._sum.amountInCents || 0) -
        (totalExpense._sum.amountInCents || 0),

      monthRevenueInCents: monthRevenue._sum.amountInCents || 0,
      monthExpensesInCents: monthExpense._sum.amountInCents || 0,
    };
  }

  async create(data: CreateTransactionInput, userId: string) {
    if (!userId) {
      throw new Error("User must be provided");
    }

    const { description, amountInCents, categoryId, date, type } = data;

    const findCategory = await prisma.category.findUnique({
      where: {
        id: categoryId,
        userId,
      },
    });

    if (!findCategory) throw new Error("Category not found");

    return prisma.transaction.create({
      data: {
        description,
        type,
        amountInCents,
        date: normalizeDate(date),
        categoryId,
        userId,
      },
    });
  }

  async update(data: CreateTransactionInput, id: string, userId: string) {
    if (!userId) {
      throw new Error("User must be provided");
    }

    const transaction = await prisma.transaction.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!transaction) throw new Error("Transaction not found");

    const { description, type, amountInCents, date, categoryId } = data;

    return prisma.transaction.update({
      where: {
        id,
      },
      data: {
        description,
        type,
        amountInCents,
        date: normalizeDate(date),
        categoryId,
      },
    });
  }

  async delete(id: string, userId: string): Promise<boolean> {
    if (!userId) {
      throw new Error("User must be provided");
    }

    const transaction = await prisma.transaction.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!transaction) return true;

    await prisma.transaction.delete({
      where: {
        id,
      },
    });

    return true;
  }

  async countTransactionsByCategoryId(categoryId: string) {
    return prisma.transaction.count({
      where: {
        categoryId,
      },
    });
  }
}
