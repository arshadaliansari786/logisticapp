import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { config } from '@config/config';
import { swaggerSpec } from '@config/swagger';
import { errorHandler } from '@common/middleware/errorMiddleware';

// Routes
import authRoutes from '@modules/auth/auth.routes';
import pickupRoutes from '@modules/pickup/pickup.routes';
import deliveryRoutes from '@modules/delivery/delivery.routes';
import attendanceRoutes from '@modules/attendance/attendance.routes';
import tripRoutes from '@modules/trip/trip.routes';
import profileRoutes from '@modules/profile/profile.routes';
import fileRoutes from '@modules/file/file.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// API Documentation
app.use(`${config.swagger.path}`, swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/files', fileRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error Handler (Must be last)
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`${config.appName} v${config.appVersion} running on port ${config.port}`);
  console.log(`API docs available at http://localhost:${config.port}${config.swagger.path}`);
});

export default app;
