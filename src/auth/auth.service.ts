import { ConflictException, Injectable } from '@nestjs/common';
import { UserModel } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { DatabaseService } from 'src/database/database.service';
import { AuthErrorMessages } from './auth.constants';
import { UserEntity } from 'src/user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './auth.interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private database: DatabaseService,
		private jwtService: JwtService
	) {}

	async createUser(dto: RegisterDto): Promise<UserModel> {
		const existedUser = await this.database.userModel.findUnique({ where: { login: dto.login } });
		if (existedUser) {
			throw new ConflictException(AuthErrorMessages.ALREADY_EXIST);
		}
		const entity = await new UserEntity({ ...dto, passwordHash: '' }).setPassword(dto.password);
		return this.database.userModel.create({ data: entity });
	}

	async verifyUser(dto: LoginDto): Promise<boolean> {
		const user = await this.database.userModel.findUnique({ where: { login: dto.login } });
		if (!user) {
			return false;
		}
		const entity = new UserEntity(user);
		return entity.comparePassword(dto.password);
	}

	async generateToken(payload: JwtPayload): Promise<string> {
		const token = await this.jwtService.signAsync(payload);
		return token;
	}
}
