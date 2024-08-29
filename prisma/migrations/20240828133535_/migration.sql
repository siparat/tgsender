/*
  Warnings:

  - A unique constraint covering the columns `[tgId]` on the table `UserModel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `UserModel` will be added. If there are existing duplicate values, this will fail.
  - The required column `token` was added to the `UserModel` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('text', 'photo', 'audio', 'video', 'animation', 'voice', 'document');

-- AlterTable
ALTER TABLE "UserModel" ADD COLUMN     "tgId" INTEGER,
ADD COLUMN     "token" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "MessageModel" (
    "id" SERIAL NOT NULL,
    "label" TEXT,
    "userTgId" INTEGER NOT NULL,
    "text" TEXT,
    "entities" JSONB[],
    "photo" JSONB,
    "audio" JSONB,
    "video" JSONB,
    "animation" JSONB,
    "voice" JSONB,
    "document" JSONB,
    "type" "MessageType" NOT NULL,

    CONSTRAINT "MessageModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserModel_tgId_key" ON "UserModel"("tgId");

-- CreateIndex
CREATE UNIQUE INDEX "UserModel_token_key" ON "UserModel"("token");

-- AddForeignKey
ALTER TABLE "MessageModel" ADD CONSTRAINT "MessageModel_userTgId_fkey" FOREIGN KEY ("userTgId") REFERENCES "UserModel"("tgId") ON DELETE RESTRICT ON UPDATE CASCADE;
