/*
  Warnings:

  - Added the required column `name` to the `Secret` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Secret" ADD COLUMN     "name" TEXT NOT NULL;
