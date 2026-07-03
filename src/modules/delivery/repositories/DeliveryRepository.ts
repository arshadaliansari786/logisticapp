import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '@common/exceptions/AppError';

const prisma = new PrismaClient();

export class DeliveryRepository {
  async create(data: any) {
    return prisma.delivery.create({
      data,
    });
  }

  async findById(id: string) {
    return prisma.delivery.findUnique({
      where: { id },
      include: { pickup: true },
    });
  }

  async findByDeliveryNumber(deliveryNumber: string) {
    return prisma.delivery.findUnique({
      where: { deliveryNumber },
      include: { pickup: true },
    });
  }

  async findByPickupId(pickupId: string) {
    return prisma.delivery.findFirst({
      where: { pickupId },
    });
  }

  async findAll(filter?: any, skip?: number, take?: number) {
    return prisma.delivery.findMany({
      where: filter,
      skip,
      take,
      include: { pickup: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(filter?: any) {
    return prisma.delivery.count({
      where: filter,
    });
  }

  async update(id: string, data: any) {
    return prisma.delivery.update({
      where: { id },
      data,
    });
  }
}
