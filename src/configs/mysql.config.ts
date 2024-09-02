import { ConfigService } from '@nestjs/config';
import { createPool, Pool } from 'mysql2/promise';

export const getMySqlConfig = async (config: ConfigService): Promise<Pool> => {
	return createPool({
		host: config.get('MYSQL_HOST'),
		port: config.get('MYSQL_PORT'),
		user: config.get('MYSQL_USER'),
		password: config.get('MYSQL_PASSWORD'),
		database: config.get('MYSQL_DB')
	});
};
