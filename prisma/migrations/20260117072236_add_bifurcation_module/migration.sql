-- CreateTable
CREATE TABLE `Bifurcation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adminId` INTEGER NOT NULL,
    `projectId` INTEGER NOT NULL,
    `totalInvestment` DOUBLE NOT NULL,
    `totalCost` DOUBLE NOT NULL,
    `totalRevenue` DOUBLE NOT NULL,
    `profitOrLoss` DOUBLE NOT NULL,
    `locked` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Bifurcation_projectId_key`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BifurcationPartner` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bifurcationId` INTEGER NOT NULL,
    `partnerId` INTEGER NOT NULL,
    `investmentAmount` DOUBLE NOT NULL,
    `ownershipPercent` DOUBLE NOT NULL,
    `shareAmount` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bifurcation` ADD CONSTRAINT `Bifurcation_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bifurcation` ADD CONSTRAINT `Bifurcation_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BifurcationPartner` ADD CONSTRAINT `BifurcationPartner_bifurcationId_fkey` FOREIGN KEY (`bifurcationId`) REFERENCES `Bifurcation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BifurcationPartner` ADD CONSTRAINT `BifurcationPartner_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `Partner`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
