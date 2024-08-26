import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserModel } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DatabaseService } from 'src/database/database.service';
import { JwtPayload } from '../auth.interfaces';
import { AuthErrorMessages } from '../auth.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private database: DatabaseService,
		config: ConfigService
	) {
		super({
			secretOrKey: config.get('SECRET'),
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			passReqToCallback: false
		});
	}

	async validate(payload: JwtPayload): Promise<UserModel> {
		const user = await this.database.userModel.findUnique({ where: { id: payload.id } });
		if (!user) {
			throw new NotFoundException(AuthErrorMessages.NOT_FOUND);
		}
		return user;
	}
}
