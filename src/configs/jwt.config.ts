import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtConfig = (config: ConfigService): JwtModuleOptions => {
	return {
		secret: config.get('SECRET')
	};
};
