import { prisma } from "../../prisma/prisma";
import { UpdateUserInput } from "../dtos/input/user.input";

export class UserService {
  async update(data: UpdateUserInput, userId: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: data.name,
      },
    });
  }
}
