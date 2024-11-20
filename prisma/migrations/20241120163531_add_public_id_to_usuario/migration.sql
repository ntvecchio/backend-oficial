/*
  Warnings:

  - A unique constraint covering the columns `[public_id]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - The required column `public_id` was added to the `Usuario` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `public_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Usuario_public_id_key` ON `Usuario`(`public_id`);
