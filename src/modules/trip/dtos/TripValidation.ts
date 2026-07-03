import * as yup from 'yup';
import { validateData } from '@common/validators/validator';

export class TripValidation {
  static createSchema = yup.object().shape({
    vehicleNumber: yup.string().min(3, 'Vehicle number is required').required(),
    openingMeter: yup.number().positive('Opening meter must be positive').required(),
    tripDate: yup.date().required(),
  });

  static closeSchema = yup.object().shape({
    closingMeter: yup.number().positive('Closing meter must be positive').required(),
  });

  static async validateCreate(data: any) {
    return validateData(this.createSchema, data);
  }

  static async validateClose(data: any) {
    return validateData(this.closeSchema, data);
  }
}
