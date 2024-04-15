/*
  Warnings:

  - You are about to drop the column `user_id` on the `Secret` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Secret" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "username" TEXT,
ALTER COLUMN "access_token" DROP NOT NULL;
