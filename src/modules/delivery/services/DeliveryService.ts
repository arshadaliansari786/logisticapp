import { DeliveryRepository } from '../repositories/DeliveryRepository';
import { UpdateDeliveryDTO } from '../dtos/DeliveryDTO';
import { DeliveryValidation } from '../dtos/DeliveryValidation';
import { NotFoundError } from '@common/exceptions/AppError';
import { IdUtil } from '@common/utils/commonUtils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DeliveryService {
  private deliveryRepository: DeliveryRepository;

  constructor() {
    this.deliveryRepository = new DeliveryRepository();
  }

  async createDelivery(pickupId: string) {
    const deliveryNumber = IdUtil.generateDeliveryNumber();

    return this.deliveryRepository.create({
      deliveryNumber,
      pickupId,
      status: 'PENDING',
    });
  }

  async getDeliveryById(id: string) {
    const delivery = await this.deliveryRepository.findById(id);
    if (!delivery) {
      throw new NotFoundError('Delivery not found');
    }
    return delivery;
  }

  async getDeliveryByNumber(deliveryNumber: string) {
    const delivery = await this.deliveryRepository.findByDeliveryNumber(deliveryNumber);
    if (!delivery) {
      throw new NotFoundError('Delivery not found');
    }
    return delivery;
  }

  async updateDelivery(id: string, updateData: UpdateDeliveryDTO, deliveryImagePath?: string, signatureImagePath?: string) {
    await this.getDeliveryById(id);

    const validatedData = await DeliveryValidation.validateUpdate(updateData);

    const updatePayload: any = {
      status: validatedData.status,
      remarks: validatedData.remarks,
    };

    if (deliveryImagePath) {
      updatePayload.deliveryImagePath = deliveryImagePath;
    }

    if (signatureImagePath) {
      updatePayload.signatureImagePath = signatureImagePath;
    }

    if (validatedData.status === 'DELIVERED') {
      updatePayload.deliveredAt = new Date();
    }

    const delivery = await this.deliveryRepository.update(id, updatePayload);
    return delivery;
  }

  async getDeliveriesList(pickupId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const deliveries = await this.deliveryRepository.findAll({ pickupId }, skip, limit);
    const total = await this.deliveryRepository.count({ pickupId });

    return {
      data: deliveries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getPendingDeliveries(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const deliveries = await this.deliveryRepository.findAll({ status: 'PENDING' }, skip, limit);
    const total = await this.deliveryRepository.count({ status: 'PENDING' });

    return {
      data: deliveries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
