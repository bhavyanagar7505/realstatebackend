/*
  Warnings:

  - Added the required column `name` to the `super_admins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `super_admins`
ADD COLUMN `name` VARCHAR(191) NOT NULL DEFAULT 'Super Admin';

