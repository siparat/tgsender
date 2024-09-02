import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseProvideKeys } from './database.constants';
import { MySqlService } from './mysql.service';
import { getMySqlConfig } from 'src/configs/mysql.config';

@Global()
@Module({
	imports: [ConfigModule],
	providers: [
		DatabaseService,
		MySqlService,
		{
			provide: DatabaseProvideKeys.MY_SQL,
			inject: [ConfigService],
			useFactory: getMySqlConfig
		}
	],
	exports: [DatabaseService, MySqlService]
})
export class DatabaseModule {}
