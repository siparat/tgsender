import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from './configs/jwt.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SERVE_ROOT_PATH, UPLOAD_ROOT_PATH } from './file/file.constants';
import { ChannelModule } from './channel/channel.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { getTelegrafConfig } from './configs/telegraf.config';
import { BotModule } from './bot/bot.module';
import { MessageModule } from './message/message.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		DatabaseModule,
		AuthModule,
		UserModule,
		ChannelModule,
		BotModule,
		ServeStaticModule.forRoot({ rootPath: UPLOAD_ROOT_PATH, serveRoot: SERVE_ROOT_PATH }),
		TelegrafModule.forRootAsync({ imports: [ConfigModule], inject: [ConfigService], useFactory: getTelegrafConfig }),
		JwtModule.registerAsync({
			global: true,
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig
		}),
		MessageModule
	]
})
export class AppModule {}
