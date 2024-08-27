import { Injectable } from '@nestjs/common';
import { ChannelModel } from '@prisma/client';
import { AddChannelDto } from './dto/add-channel.dto';
import { DatabaseService } from 'src/database/database.service';
import { ChannelEntity } from './entity/channel.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChannelService {
	constructor(
		private database: DatabaseService,
		private config: ConfigService
	) {}

	async addChannel(dto: AddChannelDto, userId: number): Promise<ChannelModel> {
		const entity = new ChannelEntity({ ...dto, userId });

		const secret = this.config.get('SECRET_TOKEN');
		entity.encryptToken(secret);

		const channel = await this.database.channelModel.create({ data: entity });
		return channel;
	}
}
