import { FileRepository } from '../repositories/FileRepository';
import { NotFoundError } from '@common/exceptions/AppError';
import { FileUtil } from '@common/utils/fileUtil';
import fs from 'fs';
import path from 'path';

export class FileService {
  private fileRepository: FileRepository;

  constructor() {
    this.fileRepository = new FileRepository();
  }

  async uploadFile(file: any, moduleName: string, entityId: string, userId?: string) {
    if (!FileUtil.validateFileSize(file.size)) {
      throw new Error('File size exceeds limit');
    }

    if (!FileUtil.isImageFile(file.mimetype) && !FileUtil.isDocumentFile(file.mimetype)) {
      throw new Error('File type not allowed');
    }

    const filePath = `/uploads/${moduleName}/${file.filename}`;

    const fileRecord = await this.fileRepository.create({
      moduleName,
      entityId,
      fileName: file.originalname,
      filePath,
      fileType: file.mimetype,
      fileSize: file.size,
      userId,
    });

    return fileRecord;
  }

  async getFilesByEntityId(entityId: string) {
    return this.fileRepository.findByEntityId(entityId);
  }

  async deleteFile(fileId: string) {
    const file = await this.fileRepository.findById(fileId);
    if (!file) {
      throw new NotFoundError('File not found');
    }

    // Delete physical file
    const filePath = path.join(process.cwd(), file.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete database record
    return this.fileRepository.delete(fileId);
  }

  async downloadFile(fileId: string) {
    const file = await this.fileRepository.findById(fileId);
    if (!file) {
      throw new NotFoundError('File not found');
    }

    const filePath = path.join(process.cwd(), file.filePath);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundError('File not found on disk');
    }

    return {
      filePath,
      fileName: file.fileName,
      mimeType: file.fileType,
    };
  }
}
