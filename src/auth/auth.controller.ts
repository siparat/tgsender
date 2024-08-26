import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModel } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthErrorMessages } from './auth.constants';
import { DatabaseService } from 'src/database/database.service';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private database: DatabaseService
	) {}

	@UsePipes(ValidationPipe)
	@Post('register')
	async register(@Body() dto: RegisterDto): Promise<UserModel> {
		const user = await this.authService.createUser(dto);
		return user;
	}

	@UsePipes(ValidationPipe)
	@HttpCode(HttpStatus.OK)
	@Post('login')
	async login(@Body() dto: LoginDto): Promise<{ token: string }> {
		const userIsVerified = await this.authService.verifyUser(dto);
		if (!userIsVerified) {
			throw new UnauthorizedException(AuthErrorMessages.WRONG_PASSWORD);
		}
		const user = (await this.database.userModel.findUnique({ where: { login: dto.login } })) as UserModel;
		const token = await this.authService.generateToken({ id: user.id });
		return { token };
	}
}
