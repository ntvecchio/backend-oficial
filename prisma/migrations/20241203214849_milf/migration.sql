-- DropForeignKey
ALTER TABLE `pontosesportivos` DROP FOREIGN KEY `PontosEsportivos_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `session` DROP FOREIGN KEY `Session_userId_fkey`;

-- AddForeignKey
ALTER TABLE `PontosEsportivos` ADD CONSTRAINT `PontosEsportivos_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
