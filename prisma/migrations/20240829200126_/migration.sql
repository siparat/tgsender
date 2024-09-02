-- DropForeignKey
ALTER TABLE "ProccessModel" DROP CONSTRAINT "ProccessModel_channelId_fkey";

-- DropForeignKey
ALTER TABLE "ProccessModel" DROP CONSTRAINT "ProccessModel_messageId_fkey";

-- AddForeignKey
ALTER TABLE "ProccessModel" ADD CONSTRAINT "ProccessModel_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "MessageModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProccessModel" ADD CONSTRAINT "ProccessModel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "ChannelModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
