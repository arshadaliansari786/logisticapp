import * as yup from 'yup';
import { validateData } from '@common/validators/validator';

export class ProfileValidation {
  static updateSchema = yup.object().shape({
    name: yup.string().min(2, 'Name must be at least 2 characters'),
    mobile: yup.string().matches(/^[0-9]{10}$/, 'Mobile must be 10 digits'),
    vehicleNumber: yup.string().min(3, 'Vehicle number is required'),
  });

  static changePasswordSchema = yup.object().shape({
    currentPassword: yup.string().required('Current password is required'),
    newPassword: yup.string().min(6, 'Password must be at least 6 characters').required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  static async validateUpdate(data: any) {
    return validateData(this.updateSchema, data);
  }

  static async validateChangePassword(data: any) {
    return validateData(this.changePasswordSchema, data);
  }
}
