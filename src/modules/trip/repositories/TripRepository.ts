import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '@common/exceptions/AppError';

const prisma = new PrismaClient();

export class TripRepository {
  async create(data: any) {
    return prisma.trip.create({
      data,
    });
  }

  async findById(id: string) {
    return prisma.trip.findUnique({
      where: { id },
    });
  }

  async findTodayTrip(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.trip.findFirst({
      where: {
        userId,
        tripDate: {
          gte: today,
        },
      },
    });
  }

  async findAll(filter?: any, skip?: number, take?: number) {
    return prisma.trip.findMany({
      where: filter,
      skip,
      take,
      orderBy: { tripDate: 'desc' },
    });
  }

  async count(filter?: any) {
    return prisma.trip.count({
      where: filter,
    });
  }

  async update(id: string, data: any) {
    return prisma.trip.update({
      where: { id },
      data,
    });
  }
}
