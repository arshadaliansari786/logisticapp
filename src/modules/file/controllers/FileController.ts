import { Request, Response } from 'express';
import { FileService } from '../services/FileService';
import { asyncHandler } from '@common/middleware/errorMiddleware';
import { IAuthRequest } from '@common/middleware/authMiddleware';

const fileService = new FileService();

export class FileController {
  uploadFile = asyncHandler(async (req: IAuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const { moduleName, entityId } = req.body;

    const file = await fileService.uploadFile(req.file, moduleName, entityId, req.user.id);

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: file,
    });
  });

  getFilesByEntity = asyncHandler(async (req: Request, res: Response) => {
    const { entityId } = req.params;

    const files = await fileService.getFilesByEntityId(entityId);

    res.status(200).json({
      success: true,
      message: 'Files retrieved successfully',
      data: files,
    });
  });

  deleteFile = asyncHandler(async (req: Request, res: Response) => {
    await fileService.deleteFile(req.params.fileId);

    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
    });
  });

  downloadFile = asyncHandler(async (req: Request, res: Response) => {
    const fileInfo = await fileService.downloadFile(req.params.fileId);

    res.download(fileInfo.filePath, fileInfo.fileName);
  });
}
