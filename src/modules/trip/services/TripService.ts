import { TripRepository } from '../repositories/TripRepository';
import { CreateTripDTO, CloseTripDTO } from '../dtos/TripDTO';
import { TripValidation } from '../dtos/TripValidation';
import { NotFoundError } from '@common/exceptions/AppError';

export class TripService {
  private tripRepository: TripRepository;

  constructor() {
    this.tripRepository = new TripRepository();
  }

  async createTrip(userId: string, createData: CreateTripDTO, openingMeterImagePath?: string) {
    const validatedData = await TripValidation.validateCreate(createData);

    // Check if trip already exists for today
    const existingTrip = await this.tripRepository.findTodayTrip(userId);
    if (existingTrip && !existingTrip.closingMeter) {
      throw new Error('Trip already started for today');
    }

    const trip = await this.tripRepository.create({
      userId,
      vehicleNumber: validatedData.vehicleNumber,
      tripDate: validatedData.tripDate,
      openingMeter: validatedData.openingMeter,
      openingMeterImagePath,
    });

    return trip;
  }

  async closeTrip(userId: string, tripId: string, closeData: CloseTripDTO, closingMeterImagePath?: string) {
    const validatedData = await TripValidation.validateClose(closeData);

    const trip = await this.tripRepository.findById(tripId);
    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    if (trip.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (trip.closingMeter) {
      throw new Error('Trip already closed');
    }

    const totalDistance = Number(validatedData.closingMeter) - Number(trip.openingMeter);

    const updatedTrip = await this.tripRepository.update(tripId, {
      closingMeter: validatedData.closingMeter,
      closingMeterImagePath,
      totalDistance: totalDistance > 0 ? totalDistance : 0,
    });

    return updatedTrip;
  }

  async getTripHistory(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const trips = await this.tripRepository.findAll({ userId }, skip, limit);
    const total = await this.tripRepository.count({ userId });

    return {
      data: trips,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getTodayTrip(userId: string) {
    return this.tripRepository.findTodayTrip(userId);
  }

  async getTotalDistanceToday(userId: string): Promise<number> {
    const todayTrip = await this.tripRepository.findTodayTrip(userId);
    if (!todayTrip || !todayTrip.totalDistance) {
      return 0;
    }
    return todayTrip.totalDistance.toNumber?.() ?? 0;
  }
}
