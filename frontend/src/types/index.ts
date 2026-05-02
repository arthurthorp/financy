export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export type Category = {
  id: string;
  title: string;
  description?: string;
  icon: string;
  color: string;
  transactionsSummary: {
    count: number;
    totalAmountInCents: number;
  };
};

export type Transaction = {
  id: string;
  description: string;
  amountInCents: number;
  type: "REVENUE" | "EXPENSE";
  date: string;
  category: Category;
};

export type ListTransactionsOutput = {
  listTransactions: {
    data: Transaction[];
    total: number;
    totalPages: number;
    currentPage: number;
  };
};

export type ListRecentTransactionsOutput = {
  listRecentsTransactions: Transaction[];
};

export type HomeDashboardOutput = {
  homeDashboard: {
    monthExpensesInCents: number;
    totalBalanceInCents: number;
    monthRevenueInCents: number;
  };
};

export type TransactionFilters = {
  description?: string;
  type?: "REVENUE" | "EXPENSE";
  categoryId?: string;
  month?: number;
  year?: number;
};

export type ListTransactionsInput = {
  page: number;
  limit: number;
  filters?: TransactionFilters;
};

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateUserInput {
  name: string;
}

export interface CreateCategoryInput {
  title: string;
  description?: string;
  icon: string;
  color: string;
}
export interface UpdateCategoryOutput {
  id: string;
}

export interface UpdateCategoryVariables {
  data: CreateCategoryInput;
  updateCategoryId: string;
}

export interface CreateTransactionInput {
  type: "REVENUE" | "EXPENSE";
  description: string;
  date: string;
  amountInCents: number;
  categoryId: string;
}

export interface UpdateTransactionInputVariables {
  data: CreateTransactionInput;
  updateTransactionId: string;
}

export interface RefreshTokenOutput {
  refreshToken: {
    token: string;
    refreshToken: string;
    user: User;
  };
}
