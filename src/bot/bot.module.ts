import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { UserModule } from 'src/user/user.module';
import { BotService } from './bot.service';

@Module({ imports: [UserModule], providers: [BotUpdate, BotService], exports: [BotService] })
export class BotModule {}
