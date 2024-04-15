/*
  Warnings:

  - The primary key for the `Secret` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `secret_id` on the `Secret` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Secret" DROP CONSTRAINT "Secret_pkey",
DROP COLUMN "secret_id",
ADD CONSTRAINT "Secret_pkey" PRIMARY KEY ("name", "repository_id");
