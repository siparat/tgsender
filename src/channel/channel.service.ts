import { Injectable, NotFoundException } from '@nestjs/common';
import { ChannelModel } from '@prisma/client';
import { AddChannelDto } from './dto/add-channel.dto';
import { DatabaseService } from 'src/database/database.service';
import { ChannelEntity } from './entity/channel.entity';
import { ConfigService } from '@nestjs/config';
import { ChannelErrorMssages } from './channel.constants';
import { FileService } from 'src/file/file.service';

@Injectable()
export class ChannelService {
	constructor(
		private database: DatabaseService,
		private config: ConfigService,
		private fileService: FileService
	) {}

	async addChannel(dto: AddChannelDto, userId: number): Promise<ChannelModel> {
		const entity = new ChannelEntity({ ...dto, userId });

		const secret = this.config.get('SECRET_TOKEN');
		entity.encryptToken(secret);

		const channel = await this.database.channelModel.create({ data: entity });
		return channel;
	}

	async deleteChannel(id: number, userId: number): Promise<ChannelModel> {
		const channel = await this.database.channelModel.findUnique({ where: { id } });
		if (!channel) {
			throw new NotFoundException(ChannelErrorMssages.NOT_FOUND);
		}
		if (channel.userId !== userId) {
			throw new NotFoundException(ChannelErrorMssages.FORBIDDEN);
		}
		const deletedChannel = await this.database.channelModel.delete({ where: { id } });
		await this.fileService.deleteImageFromUrl(deletedChannel.avatar);
		return deletedChannel;
	}
}
