import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '@common/exceptions/AppError';

const prisma = new PrismaClient();

export class PickupRepository {
  async create(data: any) {
    return prisma.pickup.create({
      data,
    });
  }

  async findById(id: string) {
    return prisma.pickup.findUnique({
      where: { id },
      include: { deliveries: true },
    });
  }

  async findByPickupNumber(pickupNumber: string) {
    return prisma.pickup.findUnique({
      where: { pickupNumber },
    });
  }

  async findAll(filter?: any, skip?: number, take?: number) {
    return prisma.pickup.findMany({
      where: filter,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(filter?: any) {
    return prisma.pickup.count({
      where: filter,
    });
  }

  async update(id: string, data: any) {
    return prisma.pickup.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.pickup.delete({
      where: { id },
    });
  }

  async findByCreatedBy(userId: string, skip?: number, take?: number) {
    return prisma.pickup.findMany({
      where: { createdBy: userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }
}
