/*
  Warnings:

  - You are about to drop the column `dataTime` on the `DataClientChosen` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `DataClientChosen` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `DataClientChosen` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."DataClientChosen_number_key";

-- AlterTable
ALTER TABLE "DataClientChosen" DROP COLUMN "dataTime",
DROP COLUMN "name",
DROP COLUMN "number";
