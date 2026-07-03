import * as yup from 'yup';
import { validateData } from '@common/validators/validator';

export class AttendanceValidation {
  static checkInSchema = yup.object().shape({
    latitude: yup.number().required('Latitude is required'),
    longitude: yup.number().required('Longitude is required'),
    address: yup.string(),
  });

  static checkOutSchema = yup.object().shape({
    latitude: yup.number().required('Latitude is required'),
    longitude: yup.number().required('Longitude is required'),
    address: yup.string(),
  });

  static async validateCheckIn(data: any) {
    return validateData(this.checkInSchema, data);
  }

  static async validateCheckOut(data: any) {
    return validateData(this.checkOutSchema, data);
  }
}
