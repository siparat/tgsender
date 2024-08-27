import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { IChannelEntity } from '../channel.interface';
import { InternalServerErrorException } from '@nestjs/common';
import { ChannelErrorMssages } from '../channel.constants';

export class ChannelEntity {
	id?: number;
	name: string;
	avatar: string;
	token: string;
	userId: number;

	constructor(channel: IChannelEntity) {
		this.id = channel.id;
		this.name = channel.name;
		this.avatar = channel.avatar;
		this.token = channel.token;
		this.userId = channel.userId;
	}

	encryptToken(secret: string): void {
		const iv = randomBytes(16);
		const cipher = createCipheriv('aes-256-ctr', Buffer.from(secret), iv);
		const encryptedData = iv.toString('hex') + ':' + cipher.update(this.token, 'utf-8', 'hex') + cipher.final('hex');
		this.token = encryptedData;
	}

	decryptToken(secret: string): void {
		const parts = this.token.split(':');
		const ivHex = parts.shift();
		const encryptedData = parts.join(':');
		if (!ivHex) {
			throw new InternalServerErrorException(ChannelErrorMssages.INVALID_ENCRYPTED_TOKEN);
		}
		const iv = Buffer.from(ivHex, 'hex');
		const decipher = createDecipheriv('aes-256-ctr', Buffer.from(secret), iv);
		const decryptedData = decipher.update(encryptedData, 'hex', 'utf8') + decipher.final('utf8');
		this.token = decryptedData;
	}
}
