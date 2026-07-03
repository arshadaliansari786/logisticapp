import * as yup from 'yup';
import { validateData } from '@common/validators/validator';

export class AuthValidation {
  static loginSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  static registerSchema = yup.object().shape({
    name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    mobile: yup.string().matches(/^[0-9]{10}$/, 'Mobile must be 10 digits').required('Mobile is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    vehicleNumber: yup.string().min(3, 'Vehicle number is required').required('Vehicle number is required'),
  });

  static forgotPasswordSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
  });

  static verifyOTPSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    otp: yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
  });

  static resetPasswordSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    otp: yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
    newPassword: yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  static refreshTokenSchema = yup.object().shape({
    refreshToken: yup.string().required('Refresh token is required'),
  });

  static async validateLogin(data: any) {
    return validateData(this.loginSchema, data);
  }

  static async validateRegister(data: any) {
    return validateData(this.registerSchema, data);
  }

  static async validateForgotPassword(data: any) {
    return validateData(this.forgotPasswordSchema, data);
  }

  static async validateVerifyOTP(data: any) {
    return validateData(this.verifyOTPSchema, data);
  }

  static async validateResetPassword(data: any) {
    return validateData(this.resetPasswordSchema, data);
  }

  static async validateRefreshToken(data: any) {
    return validateData(this.refreshTokenSchema, data);
  }
}
