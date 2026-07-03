import * as yup from 'yup';
import { validateData } from '@common/validators/validator';

export class DeliveryValidation {
  static updateSchema = yup.object().shape({
    status: yup.string().oneOf(['DELIVERED', 'FAILED', 'RETURNED']).required(),
    remarks: yup.string(),
  });

  static async validateUpdate(data: any) {
    return validateData(this.updateSchema, data);
  }
}
