import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { UserModule } from 'src/user/user.module';
import { BotService } from './bot.service';
import { MessageModule } from 'src/message/message.module';

@Module({ imports: [UserModule, MessageModule], providers: [BotUpdate, BotService] })
export class BotModule {}
