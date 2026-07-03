import { PickupRepository } from '../repositories/PickupRepository';
import { CreatePickupDTO, UpdatePickupDTO } from '../dtos/PickupDTO';
import { PickupValidation } from '../dtos/PickupValidation';
import { NotFoundError } from '@common/exceptions/AppError';
import { IdUtil } from '@common/utils/commonUtils';

export class PickupService {
  private pickupRepository: PickupRepository;

  constructor() {
    this.pickupRepository = new PickupRepository();
  }

  async createPickup(createData: CreatePickupDTO, userId: string, imagePath?: string) {
    const validatedData = await PickupValidation.validateCreate(createData);

    const pickupNumber = IdUtil.generatePickupNumber();

    const pickup = await this.pickupRepository.create({
      pickupNumber,
      customerName: validatedData.customerName,
      mobileNumber: validatedData.mobileNumber,
      pickupAddress: validatedData.pickupAddress,
      deliveryAddress: validatedData.deliveryAddress,
      materialType: validatedData.materialType,
      weight: validatedData.weight,
      deliveryDate: validatedData.deliveryDate,
      remarks: validatedData.remarks,
      pickupImagePath: imagePath,
      createdBy: userId,
    });

    return pickup;
  }

  async getPickupById(id: string) {
    const pickup = await this.pickupRepository.findById(id);
    if (!pickup) {
      throw new NotFoundError('Pickup not found');
    }
    return pickup;
  }

  async getPickupByNumber(pickupNumber: string) {
    const pickup = await this.pickupRepository.findByPickupNumber(pickupNumber);
    if (!pickup) {
      throw new NotFoundError('Pickup not found');
    }
    return pickup;
  }

  async getPickupsList(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const pickups = await this.pickupRepository.findByCreatedBy(userId, skip, limit);
    const total = await this.pickupRepository.count({ createdBy: userId });

    return {
      data: pickups,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async updatePickup(id: string, updateData: UpdatePickupDTO) {
    await this.getPickupById(id);

    const validatedData = await PickupValidation.validateUpdate(updateData);

    const pickup = await this.pickupRepository.update(id, validatedData);
    return pickup;
  }

  async deletePickup(id: string) {
    await this.getPickupById(id);
    return this.pickupRepository.delete(id);
  }

  async getDashboardStats(userId: string) {
    const totalPickups = await this.pickupRepository.count({ createdBy: userId });
    const pendingPickups = await this.pickupRepository.count({
      createdBy: userId,
      status: 'PENDING',
    });

    return {
      totalPickups,
      pendingPickups,
    };
  }
}
