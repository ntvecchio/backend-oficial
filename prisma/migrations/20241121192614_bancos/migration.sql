-- DropIndex
DROP INDEX `Session_token_key` ON `session`;

-- AlterTable
ALTER TABLE `session` MODIFY `token` VARCHAR(500) NOT NULL;
