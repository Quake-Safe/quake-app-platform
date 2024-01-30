/*
  Warnings:

  - You are about to drop the column `url` on the `media` table. All the data in the column will be lost.
  - Added the required column `fileName` to the `media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalFileName` to the `media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicUrl` to the `media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "media" DROP COLUMN "url",
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "originalFileName" TEXT NOT NULL,
ADD COLUMN     "publicUrl" TEXT NOT NULL;
