-- CreateEnum
CREATE TYPE "ProccessStatus" AS ENUM ('started', 'finished');

-- CreateTable
CREATE TABLE "ProccessModel" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedTime" TIMESTAMP(3),
    "messageId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,
    "receivers" INTEGER[],
    "failed" INTEGER[],
    "status" "ProccessStatus" NOT NULL,

    CONSTRAINT "ProccessModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProccessModel" ADD CONSTRAINT "ProccessModel_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "MessageModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProccessModel" ADD CONSTRAINT "ProccessModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProccessModel" ADD CONSTRAINT "ProccessModel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "ChannelModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
