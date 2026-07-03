import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '@config/config';

export class PasswordUtil {
  static async hash(password: string): Promise<string> {
    const salt = await bcryptjs.genSalt(10);
    return bcryptjs.hash(password, salt);
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    return bcryptjs.compare(password, hash);
  }
}

export class TokenUtil {
  static generateAccessToken(payload: any): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiryTime as jwt.SignOptions['expiresIn'],
    });
  }

  static generateRefreshToken(payload: any): string {
    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiryTime as jwt.SignOptions['expiresIn'],
    });
  }

  static verifyAccessToken(token: string): any {
    return jwt.verify(token, config.jwt.secret);
  }

  static verifyRefreshToken(token: string): any {
    return jwt.verify(token, config.jwt.refreshSecret);
  }
}

export class IdUtil {
  static generateUUID(): string {
    return uuidv4();
  }

  static generatePickupNumber(): string {
    return `PU${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }

  static generateDeliveryNumber(): string {
    return `DL${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
}

export class OTPUtil {
  static generateOTP(length: number = 6): string {
    return Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, '0');
  }

  static calculateExpiry(minutes: number): Date {
    const now = new Date();
    return new Date(now.getTime() + minutes * 60000);
  }
}
