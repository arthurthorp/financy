import { User } from "@prisma/client";
import { prisma } from "../../prisma/prisma";
import { LoginInput, RegisterInput } from "../dtos/input/auth.input";
import { comparePassword, hashPassword } from "../utils/hash";
import { signJwt, verifyJwt } from "../utils/jwt";

export class AuthService {
  async login(data: LoginInput) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!existingUser) throw new Error("Invalid credentials");

    const compare = await comparePassword(data.password, existingUser.password);

    if (!compare) throw new Error("Invalid credentials");

    return this.generateTokens(existingUser);
  }

  async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return true;
  }

  async register(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hash,
      },
    });

    return this.generateTokens(user);
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = verifyJwt(refreshToken);

      const user = await prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (!user || !user.refreshToken) {
        throw new Error("Access denied");
      }

      const isValid = await comparePassword(refreshToken, user.refreshToken);

      if (!isValid) throw new Error("Access denied");

      return this.generateTokens(user);
    } catch (err) {
      throw new Error("Invalid refresh token");
    }
  }

  async generateTokens(user: User) {
    const token = signJwt({ id: user.id, email: user.email }, "15m");
    const refreshToken = signJwt({ id: user.id, email: user.email }, "1d");

    const hashedRefreshToken = await hashPassword(refreshToken);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    return { token, refreshToken, user };
  }
}
