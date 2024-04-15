/*
  Warnings:

  - Added the required column `key_id` to the `Repository` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public_key` to the `Repository` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Repository" ADD COLUMN     "key_id" TEXT NOT NULL,
ADD COLUMN     "public_key" TEXT NOT NULL;
