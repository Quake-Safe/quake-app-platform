/*
  Warnings:

  - You are about to drop the column `thumbnailUrl` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the `post_story_media` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[mediaId]` on the table `posts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mediaId` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- DropForeignKey
ALTER TABLE "post_story" DROP CONSTRAINT "post_story_mediaId_fkey";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "thumbnailUrl",
ADD COLUMN     "mediaId" TEXT NOT NULL;

-- DropTable
DROP TABLE "post_story_media";

-- DropEnum
DROP TYPE "PostStoryMediaType";

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'IMAGE',

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "posts_mediaId_key" ON "posts"("mediaId");

-- AddForeignKey
ALTER TABLE "post_story" ADD CONSTRAINT "post_story_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
