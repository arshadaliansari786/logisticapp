import path from 'path';
import { config } from '@config/config';

export class FileUtil {
  static getUploadDir(folderName: string): string {
    return path.join(config.upload.uploadDir, folderName);
  }

  static getFileName(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(originalName);
    const name = path.basename(originalName, ext);
    return `${name}-${timestamp}-${random}${ext}`;
  }

  static isImageFile(mimeType: string): boolean {
    return config.upload.allowedImageTypes.includes(mimeType);
  }

  static isDocumentFile(mimeType: string): boolean {
    return config.upload.allowedDocumentTypes.includes(mimeType);
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  static validateFileSize(fileSize: number, maxSize: number = config.upload.maxFileSize): boolean {
    return fileSize <= maxSize;
  }
}
