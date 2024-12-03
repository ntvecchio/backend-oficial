/*
  Warnings:

  - Added the required column `bairro` to the `PontosEsportivos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cep` to the `PontosEsportivos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cidade` to the `PontosEsportivos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `PontosEsportivos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pontosesportivos` ADD COLUMN `bairro` VARCHAR(100) NOT NULL,
    ADD COLUMN `cep` VARCHAR(15) NOT NULL,
    ADD COLUMN `cidade` VARCHAR(100) NOT NULL,
    ADD COLUMN `numero` VARCHAR(10) NOT NULL;
