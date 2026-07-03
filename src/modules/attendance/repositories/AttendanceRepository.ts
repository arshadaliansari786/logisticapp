import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '@common/exceptions/AppError';

const prisma = new PrismaClient();

export class AttendanceRepository {
  async create(data: any) {
    return prisma.attendance.create({
      data,
    });
  }

  async findById(id: string) {
    return prisma.attendance.findUnique({
      where: { id },
    });
  }

  async findTodayCheckIn(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.attendance.findFirst({
      where: {
        userId,
        checkInTime: {
          gte: today,
        },
      },
    });
  }

  async findAll(filter?: any, skip?: number, take?: number) {
    return prisma.attendance.findMany({
      where: filter,
      skip,
      take,
      orderBy: { checkInTime: 'desc' },
    });
  }

  async count(filter?: any) {
    return prisma.attendance.count({
      where: filter,
    });
  }

  async update(id: string, data: any) {
    return prisma.attendance.update({
      where: { id },
      data,
    });
  }
}
