import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '@common/exceptions/AppError';

const prisma = new PrismaClient();

export class FileRepository {
  async create(data: any) {
    return prisma.file.create({
      data,
    });
  }

  async findById(id: string) {
    return prisma.file.findUnique({
      where: { id },
    });
  }

  async findByEntityId(entityId: string) {
    return prisma.file.findMany({
      where: { entityId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(filter?: any, skip?: number, take?: number) {
    return prisma.file.findMany({
      where: filter,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(filter?: any) {
    return prisma.file.count({
      where: filter,
    });
  }

  async delete(id: string) {
    return prisma.file.delete({
      where: { id },
    });
  }
}
