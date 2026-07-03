import * as yup from 'yup';
import { validateData } from '@common/validators/validator';

export class PickupValidation {
  static createSchema = yup.object().shape({
    customerName: yup.string().min(2, 'Customer name is required').required(),
    mobileNumber: yup.string().matches(/^[0-9]{10}$/, 'Mobile must be 10 digits').required(),
    pickupAddress: yup.string().min(5, 'Pickup address is required').required(),
    deliveryAddress: yup.string().min(5, 'Delivery address is required').required(),
    materialType: yup.string().min(2, 'Material type is required').required(),
    weight: yup.number().positive('Weight must be positive').required(),
    deliveryDate: yup.date().min(new Date(), 'Delivery date must be in future').required(),
    remarks: yup.string(),
  });

  static updateSchema = yup.object().shape({
    status: yup.string().oneOf(['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'CANCELLED']),
    remarks: yup.string(),
  });

  static async validateCreate(data: any) {
    return validateData(this.createSchema, data);
  }

  static async validateUpdate(data: any) {
    return validateData(this.updateSchema, data);
  }
}
