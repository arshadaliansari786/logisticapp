import { AttendanceRepository } from '../repositories/AttendanceRepository';
import { CheckInDTO, CheckOutDTO } from '../dtos/AttendanceDTO';
import { AttendanceValidation } from '../dtos/AttendanceValidation';
import { NotFoundError } from '@common/exceptions/AppError';

export class AttendanceService {
  private attendanceRepository: AttendanceRepository;

  constructor() {
    this.attendanceRepository = new AttendanceRepository();
  }

  async checkIn(userId: string, checkInData: CheckInDTO, selfieImagePath?: string) {
    const validatedData = await AttendanceValidation.validateCheckIn(checkInData);

    // Check if already checked in today
    const existingCheckIn = await this.attendanceRepository.findTodayCheckIn(userId);
    if (existingCheckIn && !existingCheckIn.checkOutTime) {
      throw new Error('Already checked in today');
    }

    const attendance = await this.attendanceRepository.create({
      userId,
      checkInTime: new Date(),
      checkInLatitude: validatedData.latitude,
      checkInLongitude: validatedData.longitude,
      checkInAddress: validatedData.address,
      selfieImagePath,
    });

    return attendance;
  }

  async checkOut(userId: string, checkOutData: CheckOutDTO) {
    const validatedData = await AttendanceValidation.validateCheckOut(checkOutData);

    const todayCheckIn = await this.attendanceRepository.findTodayCheckIn(userId);
    if (!todayCheckIn) {
      throw new NotFoundError('No check-in found for today');
    }

    const attendance = await this.attendanceRepository.update(todayCheckIn.id, {
      checkOutTime: new Date(),
      checkOutLatitude: validatedData.latitude,
      checkOutLongitude: validatedData.longitude,
      checkOutAddress: validatedData.address,
    });

    return attendance;
  }

  async getAttendanceHistory(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const attendances = await this.attendanceRepository.findAll({ userId }, skip, limit);
    const total = await this.attendanceRepository.count({ userId });

    return {
      data: attendances,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getTodayStatus(userId: string) {
    const todayCheckIn = await this.attendanceRepository.findTodayCheckIn(userId);
    return todayCheckIn;
  }
}
