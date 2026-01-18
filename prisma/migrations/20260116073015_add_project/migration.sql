-- CreateTable
CREATE TABLE `Project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adminId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `totalValuation` DOUBLE NOT NULL,
    `landCost` DOUBLE NOT NULL,
    `infrastructureCost` DOUBLE NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `expectedCompletion` INTEGER NOT NULL,
    `possessionDate` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PLANNING',
    `amenities` VARCHAR(191) NULL,
    `facilities` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `reraApproved` BOOLEAN NOT NULL DEFAULT false,
    `fireApproved` BOOLEAN NOT NULL DEFAULT false,
    `govtApproved` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Project_adminId_idx`(`adminId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
