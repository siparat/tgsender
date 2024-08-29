import { Injectable } from '@nestjs/common';
import { UserModel } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
	constructor(private database: DatabaseService) {}

	findByTgId(tgId: number): Promise<UserModel | null> {
		return this.database.userModel.findUnique({ where: { tgId } });
	}

	findByToken(token: string): Promise<UserModel | null> {
		return this.database.userModel.findUnique({ where: { token } });
	}
}
