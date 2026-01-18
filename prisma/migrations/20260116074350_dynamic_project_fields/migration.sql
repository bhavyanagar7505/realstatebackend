/*
  Warnings:

  - You are about to drop the column `amenities` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `facilities` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `fireApproved` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `govtApproved` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `reraApproved` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Project` DROP COLUMN `amenities`,
    DROP COLUMN `facilities`,
    DROP COLUMN `fireApproved`,
    DROP COLUMN `govtApproved`,
    DROP COLUMN `notes`,
    DROP COLUMN `reraApproved`;

-- CreateTable
CREATE TABLE `ProjectField` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adminId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `fieldType` ENUM('TEXT', 'NUMBER', 'BOOLEAN', 'DATE') NOT NULL,
    `category` ENUM('GENERAL', 'COMPLIANCE') NOT NULL,
    `required` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectFieldValue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectId` INTEGER NOT NULL,
    `fieldId` INTEGER NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ProjectFieldValue_projectId_fieldId_key`(`projectId`, `fieldId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProjectField` ADD CONSTRAINT `ProjectField_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectFieldValue` ADD CONSTRAINT `ProjectFieldValue_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectFieldValue` ADD CONSTRAINT `ProjectFieldValue_fieldId_fkey` FOREIGN KEY (`fieldId`) REFERENCES `ProjectField`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
