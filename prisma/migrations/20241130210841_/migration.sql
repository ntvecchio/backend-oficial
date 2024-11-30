/*
  Warnings:

  - You are about to alter the column `nome` on the `modalidade` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `nome` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `telefone` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(15)`.
  - You are about to drop the `_modalidadesusuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `perfilusuario` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[incrementKey]` on the table `PontosEsportivos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `PontosEsportivos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_modalidadesusuario` DROP FOREIGN KEY `_ModalidadesUsuario_A_fkey`;

-- DropForeignKey
ALTER TABLE `_modalidadesusuario` DROP FOREIGN KEY `_ModalidadesUsuario_B_fkey`;

-- DropForeignKey
ALTER TABLE `perfilusuario` DROP FOREIGN KEY `PerfilUsuario_usuarioId_fkey`;

-- AlterTable
ALTER TABLE `modalidade` MODIFY `nome` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `pontosesportivos` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `endereco` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `usuario` MODIFY `nome` VARCHAR(100) NOT NULL,
    MODIFY `email` VARCHAR(200) NOT NULL,
    MODIFY `telefone` VARCHAR(15) NOT NULL,
    MODIFY `senha` VARCHAR(500) NOT NULL;

-- DropTable
DROP TABLE `_modalidadesusuario`;

-- DropTable
DROP TABLE `perfilusuario`;

-- CreateIndex
CREATE UNIQUE INDEX `PontosEsportivos_incrementKey_key` ON `PontosEsportivos`(`incrementKey`);
