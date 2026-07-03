BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] VARCHAR(36) NOT NULL,
    [name] VARCHAR(255) NOT NULL,
    [email] VARCHAR(255) NOT NULL,
    [mobile] VARCHAR(20) NOT NULL,
    [passwordHash] VARCHAR(500) NOT NULL,
    [vehicleNumber] VARCHAR(50) NOT NULL,
    [role] VARCHAR(50) NOT NULL CONSTRAINT [User_role_df] DEFAULT 'DRIVER',
    [isActive] BIT NOT NULL CONSTRAINT [User_isActive_df] DEFAULT 1,
    [refreshToken] VARCHAR(500),
    [refreshTokenExpiryAt] DATETIME2,
    [lastLoginAt] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [User_mobile_key] UNIQUE NONCLUSTERED ([mobile])
);

-- CreateTable
CREATE TABLE [dbo].[Pickup] (
    [id] VARCHAR(36) NOT NULL,
    [pickupNumber] VARCHAR(50) NOT NULL,
    [customerName] VARCHAR(255) NOT NULL,
    [mobileNumber] VARCHAR(20) NOT NULL,
    [pickupAddress] TEXT NOT NULL,
    [deliveryAddress] TEXT NOT NULL,
    [materialType] VARCHAR(100) NOT NULL,
    [weight] DECIMAL(10,2) NOT NULL,
    [deliveryDate] DATETIME2 NOT NULL,
    [status] VARCHAR(50) NOT NULL CONSTRAINT [Pickup_status_df] DEFAULT 'PENDING',
    [remarks] TEXT,
    [pickupImagePath] VARCHAR(500),
    [createdBy] VARCHAR(36) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Pickup_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Pickup_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Pickup_pickupNumber_key] UNIQUE NONCLUSTERED ([pickupNumber])
);

-- CreateTable
CREATE TABLE [dbo].[Delivery] (
    [id] VARCHAR(36) NOT NULL,
    [deliveryNumber] VARCHAR(50) NOT NULL,
    [pickupId] VARCHAR(36) NOT NULL,
    [status] VARCHAR(50) NOT NULL CONSTRAINT [Delivery_status_df] DEFAULT 'PENDING',
    [remarks] TEXT,
    [deliveryImagePath] VARCHAR(500),
    [signatureImagePath] VARCHAR(500),
    [deliveredAt] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Delivery_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Delivery_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Delivery_deliveryNumber_key] UNIQUE NONCLUSTERED ([deliveryNumber])
);

-- CreateTable
CREATE TABLE [dbo].[Attendance] (
    [id] VARCHAR(36) NOT NULL,
    [userId] VARCHAR(36) NOT NULL,
    [checkInTime] DATETIME2 NOT NULL,
    [checkOutTime] DATETIME2,
    [checkInLatitude] DECIMAL(10,8) NOT NULL,
    [checkInLongitude] DECIMAL(11,8) NOT NULL,
    [checkOutLatitude] DECIMAL(10,8),
    [checkOutLongitude] DECIMAL(11,8),
    [checkInAddress] TEXT,
    [checkOutAddress] TEXT,
    [selfieImagePath] VARCHAR(500),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Attendance_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Attendance_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Trip] (
    [id] VARCHAR(36) NOT NULL,
    [userId] VARCHAR(36) NOT NULL,
    [vehicleNumber] VARCHAR(50) NOT NULL,
    [tripDate] DATETIME2 NOT NULL,
    [openingMeter] DECIMAL(10,2) NOT NULL,
    [closingMeter] DECIMAL(10,2),
    [openingMeterImagePath] VARCHAR(500),
    [closingMeterImagePath] VARCHAR(500),
    [totalDistance] DECIMAL(10,2),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Trip_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Trip_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[File] (
    [id] VARCHAR(36) NOT NULL,
    [moduleName] VARCHAR(100) NOT NULL,
    [entityId] VARCHAR(36) NOT NULL,
    [fileName] VARCHAR(255) NOT NULL,
    [filePath] VARCHAR(500) NOT NULL,
    [fileType] VARCHAR(50) NOT NULL,
    [fileSize] BIGINT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [File_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [userId] VARCHAR(36),
    [pickupId] VARCHAR(36),
    [deliveryId] VARCHAR(36),
    [attendanceId] VARCHAR(36),
    [tripId] VARCHAR(36),
    CONSTRAINT [File_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [User_email_idx] ON [dbo].[User]([email]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [User_mobile_idx] ON [dbo].[User]([mobile]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [User_isActive_idx] ON [dbo].[User]([isActive]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Pickup_pickupNumber_idx] ON [dbo].[Pickup]([pickupNumber]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Pickup_status_idx] ON [dbo].[Pickup]([status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Pickup_createdBy_idx] ON [dbo].[Pickup]([createdBy]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Pickup_deliveryDate_idx] ON [dbo].[Pickup]([deliveryDate]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Delivery_deliveryNumber_idx] ON [dbo].[Delivery]([deliveryNumber]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Delivery_pickupId_idx] ON [dbo].[Delivery]([pickupId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Delivery_status_idx] ON [dbo].[Delivery]([status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Attendance_userId_idx] ON [dbo].[Attendance]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Attendance_checkInTime_idx] ON [dbo].[Attendance]([checkInTime]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Trip_userId_idx] ON [dbo].[Trip]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Trip_tripDate_idx] ON [dbo].[Trip]([tripDate]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Trip_vehicleNumber_idx] ON [dbo].[Trip]([vehicleNumber]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [File_moduleName_idx] ON [dbo].[File]([moduleName]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [File_entityId_idx] ON [dbo].[File]([entityId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [File_userId_idx] ON [dbo].[File]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [File_pickupId_idx] ON [dbo].[File]([pickupId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [File_deliveryId_idx] ON [dbo].[File]([deliveryId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [File_attendanceId_idx] ON [dbo].[File]([attendanceId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [File_tripId_idx] ON [dbo].[File]([tripId]);

-- AddForeignKey
ALTER TABLE [dbo].[Pickup] ADD CONSTRAINT [Pickup_createdBy_fkey] FOREIGN KEY ([createdBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Delivery] ADD CONSTRAINT [Delivery_pickupId_fkey] FOREIGN KEY ([pickupId]) REFERENCES [dbo].[Pickup]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Attendance] ADD CONSTRAINT [Attendance_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Trip] ADD CONSTRAINT [Trip_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[File] ADD CONSTRAINT [File_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[File] ADD CONSTRAINT [File_pickupId_fkey] FOREIGN KEY ([pickupId]) REFERENCES [dbo].[Pickup]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[File] ADD CONSTRAINT [File_deliveryId_fkey] FOREIGN KEY ([deliveryId]) REFERENCES [dbo].[Delivery]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[File] ADD CONSTRAINT [File_attendanceId_fkey] FOREIGN KEY ([attendanceId]) REFERENCES [dbo].[Attendance]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[File] ADD CONSTRAINT [File_tripId_fkey] FOREIGN KEY ([tripId]) REFERENCES [dbo].[Trip]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
