import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserModel } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';

@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private database: DatabaseService
	) {}

	@UseGuards(JwtAuthGuard)
	@Get('info')
	getInfo(@User() user: UserModel): UserModel {
		return user;
	}
}
