-- DropIndex
DROP INDEX `PontosEsportivos_incrementKey_key` ON `pontosesportivos`;

-- AlterTable
ALTER TABLE `pontosesportivos` MODIFY `endereco` TEXT NOT NULL;
