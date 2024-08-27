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

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		JwtModule.registerAsync({
			global: true,
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig
		}),
		DatabaseModule,
		AuthModule,
		UserModule,
		ChannelModule,
		ServeStaticModule.forRoot({ rootPath: UPLOAD_ROOT_PATH, serveRoot: SERVE_ROOT_PATH })
	]
})
export class AppModule {}
