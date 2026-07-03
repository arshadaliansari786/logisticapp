import { PrismaClient } from '@prisma/client';
import { NotFoundError, ConflictError } from '@common/exceptions/AppError';

const prisma = new PrismaClient();

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserByMobile(mobile: string) {
    return prisma.user.findUnique({
      where: { mobile },
    });
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(data: {
    name: string;
    email: string;
    mobile: string;
    passwordHash: string;
    vehicleNumber: string;
  }) {
    try {
      return await prisma.user.create({
        data: {
          ...data,
          role: 'DRIVER',
          isActive: true,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictError('Email or mobile already exists');
      }
      throw error;
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string, expiryAt: Date) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken,
        refreshTokenExpiryAt: expiryAt,
      },
    });
  }

  async updateLastLogin(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        lastLoginAt: new Date(),
      },
    });
  }

  async clearRefreshToken(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: null,
        refreshTokenExpiryAt: null,
      },
    });
  }
}
