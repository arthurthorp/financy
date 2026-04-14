import { prisma } from "../../prisma/prisma";
import { CreateCategoryInput } from "../dtos/input/category.input";
import { CategoryModel } from "../models/category.model";

export class CategoryService {
  async listByUserId(userId: string): Promise<CategoryModel[]> {
    return prisma.category.findMany({
      where: {
        userId,
      },
    });
  }

  async getCategoryById(categoryId: string): Promise<CategoryModel> {
    return prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });
  }

  async create(data: CreateCategoryInput, userId: string) {
    if (!userId) {
      throw new Error("User must be provided");
    }

    const { title, description, color, icon } = data;

    return prisma.category.create({
      data: {
        title,
        description,
        icon,
        color,
        userId,
      },
    });
  }

  async update(data: CreateCategoryInput, id: string, userId: string) {
    if (!userId) {
      throw new Error("User must be provided");
    }

    const category = await prisma.category.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!category) throw new Error("Category not found");

    const { title, description, color, icon } = data;

    return prisma.category.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        icon,
        color,
        userId,
      },
    });
  }

  async delete(id: string, userId: string): Promise<boolean> {
    if (!userId) {
      throw new Error("User must be provided");
    }

    const category = await prisma.category.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!category) return true;

    await prisma.category.delete({
      where: {
        id,
      },
    });

    return true;
  }
}
