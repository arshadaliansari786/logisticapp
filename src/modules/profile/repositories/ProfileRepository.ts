import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProfileRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        vehicleNumber: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async update(id: string, data: any) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        vehicleNumber: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });
  }

  async updatePassword(id: string, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }
}
