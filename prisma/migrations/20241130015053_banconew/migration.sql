/*
  Warnings:

  - A unique constraint covering the columns `[incrementKey]` on the table `Modalidade` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `incrementKey` to the `Modalidade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urlImage` to the `Modalidade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `modalidade` ADD COLUMN `incrementKey` INTEGER NOT NULL,
    ADD COLUMN `urlImage` TEXT NOT NULL;

-- CreateTable
CREATE TABLE `PontosEsportivos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `endereco` VARCHAR(191) NOT NULL,
    `incrementKey` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `modalidadeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Modalidade_incrementKey_key` ON `Modalidade`(`incrementKey`);

-- AddForeignKey
ALTER TABLE `PontosEsportivos` ADD CONSTRAINT `PontosEsportivos_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PontosEsportivos` ADD CONSTRAINT `PontosEsportivos_modalidadeId_fkey` FOREIGN KEY (`modalidadeId`) REFERENCES `Modalidade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
