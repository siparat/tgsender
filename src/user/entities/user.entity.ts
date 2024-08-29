import { compare, hash } from 'bcrypt';
import { IUserEntity } from '../user.interfaces';

export class UserEntity {
	id?: number;
	tgId?: number;
	login: string;
	passwordHash: string;
	token?: string;

	constructor(user: IUserEntity) {
		this.id = user.id;
		this.tgId = user.tgId ?? undefined;
		this.login = user.login;
		this.passwordHash = user.passwordHash;
		this.token = user.token;
	}

	async setPassword(password: string): Promise<UserEntity> {
		const salt = 7;
		this.passwordHash = await hash(password, salt);
		return this;
	}

	comparePassword(password: string): Promise<boolean> {
		return compare(password, this.passwordHash);
	}
}
