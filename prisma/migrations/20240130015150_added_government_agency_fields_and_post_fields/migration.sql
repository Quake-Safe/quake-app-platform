/*
  Warnings:

  - You are about to drop the `UserProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserProfileRole" AS ENUM ('NORMAL', 'GOVERNMENT_AGENCY');

-- CreateEnum
CREATE TYPE "PostStoryMediaType" AS ENUM ('IMAGE', 'VIDEO');

-- DropTable
DROP TABLE "UserProfile";

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "supabaseId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "firstName" TEXT NOT NULL DEFAULT '',
    "lastName" TEXT NOT NULL DEFAULT '',
    "middleName" TEXT NOT NULL DEFAULT '',
    "role" "UserProfileRole" NOT NULL DEFAULT 'NORMAL',
    "shortName" TEXT,
    "fullName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_story" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,

    CONSTRAINT "post_story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_story_media" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "url" TEXT NOT NULL,
    "type" "PostStoryMediaType" NOT NULL DEFAULT 'IMAGE',

    CONSTRAINT "post_story_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "thumbnailUrl" TEXT,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_supabaseId_key" ON "user_profiles"("supabaseId");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_username_key" ON "user_profiles"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_email_key" ON "user_profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_shortName_key" ON "user_profiles"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_fullName_key" ON "user_profiles"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "post_story_mediaId_key" ON "post_story"("mediaId");

-- AddForeignKey
ALTER TABLE "post_story" ADD CONSTRAINT "post_story_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_story" ADD CONSTRAINT "post_story_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "post_story_media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
