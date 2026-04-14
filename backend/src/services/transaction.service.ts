import { prisma } from "../../prisma/prisma";
import {
  CreateTransactionInput,
  PaginatedTransactionsInput,
} from "../dtos/input/transaction.input";
import { DashboardOutput } from "../dtos/output/dashboard.output";
import { PaginatedTransactionsOutput } from "../dtos/output/transaction.output";
import { TransactionModel } from "../models/transaction.model";

export class TransactionService {
  async listByUserId(
    pagination: PaginatedTransactionsInput,
    userId: string
  ): Promise<PaginatedTransactionsOutput> {
    const { page, limit } = pagination;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        skip,
        take: limit,
      }),
      prisma.transaction.count({
        where: { userId },
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

  async transactionsResume(userId: string): Promise<DashboardOutput> {
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const totalRevenue = await prisma.transaction.aggregate({
      where: {
        userId,
        type: "REVENUE",
      },
      _sum: {
        amountInCents: true,
      },
    });

    const totalExpense = await prisma.transaction.aggregate({
      where: {
        userId,
        type: "EXPENSE",
      },
      _sum: {
        amountInCents: true,
      },
    });

    // MÊS
    const monthRevenue = await prisma.transaction.aggregate({
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
    });

    const monthExpense = await prisma.transaction.aggregate({
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
    });

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

    const findCategory = await prisma.transaction.findUnique({
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
        date,
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
        date: new Date(date),
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
