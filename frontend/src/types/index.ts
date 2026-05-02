export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

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

export type UpdateCategoryVariables = {
  data: CreateCategoryInput;
  updateCategoryId: string;
};

export interface RefreshTokenOutput {
  refreshToken: {
    token: string;
    refreshToken: string;
    user: User;
  };
}
