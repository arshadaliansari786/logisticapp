import * as yup from 'yup';
import { ValidationError as AppValidationError } from '@common/exceptions/AppError';

export const validateData = async (schema: yup.Schema, data: any) => {
  try {
    return await schema.validate(data, { abortEarly: false });
  } catch (error: any) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string[]> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = [err.message];
        }
      });
      throw new AppValidationError('Validation failed', errors);
    }
    throw error;
  }
};

export const createValidationSchema = (fields: Record<string, any>) => {
  return yup.object().shape(fields);
};
