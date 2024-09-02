import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { MessageModel } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { MessageEntity } from './entities/message.entity';
import { MessageErrorMessages } from './message.constants';
import { BotService } from 'src/bot/bot.service';
import { ProccessEntity } from './entities/proccess.entity';
import { Telegraf } from 'telegraf';
import { ChannelEntity } from 'src/channel/entity/channel.entity';
import { ConfigService } from '@nestjs/config';
import { InjectBot } from 'nestjs-telegraf';

@Injectable()
export class MessageService {
	constructor(
		private database: DatabaseService,
		private botService: BotService,
		@InjectBot() private telegrafBot: Telegraf,
		private config: ConfigService
	) {}

	async deleteMessage(id: number, userTgId: number | null): Promise<MessageModel> {
		const message = await this.database.messageModel.findUnique({ where: { id } });
		if (!message) {
			throw new NotFoundException(MessageErrorMessages.NOT_FOUND);
		}
		if (message.userTgId !== userTgId) {
			throw new ForbiddenException(MessageErrorMessages.FORBIDDEN);
		}
		return this.database.messageModel.delete({ where: { id } });
	}

	async previewMessage(id: number, userTgId: number): Promise<void> {
		const message = await this.database.messageModel.findUnique({ where: { id } });
		if (!message) {
			throw new NotFoundException(MessageErrorMessages.NOT_FOUND);
		}
		if (message.userTgId !== userTgId) {
			throw new ForbiddenException(MessageErrorMessages.FORBIDDEN);
		}
		const entity = new MessageEntity(message);
		await this.botService.sendMessage(this.telegrafBot, userTgId, entity);
	}

	async runMailer(messageId: number, channelId: number, userId: number, receivers: bigint[]): Promise<void> {
		const message = await this.database.messageModel.findUnique({ where: { id: messageId } });
		const channel = await this.database.channelModel.findUnique({ where: { id: channelId } });
		if (!message || !channel) {
			throw new NotFoundException(MessageErrorMessages.NOT_FOUND);
		}
		const processEntity = new ProccessEntity({ channelId, userId, messageId, receivers, failed: [], status: 'started' });
		const proccess = await this.database.proccessModel.create({ data: processEntity, include: { channel: true, message: true } });

		const secret = this.config.get('SECRET_TOKEN');
		const messageEntity = new MessageEntity(proccess.message);
		const channelEntity = new ChannelEntity(proccess.channel);
		channelEntity.decryptToken(secret);

		const telegraf = new Telegraf(channelEntity.token);
		for (const chatId of receivers) {
			try {
				await this.botService.sendMessage(telegraf, Number(chatId), messageEntity);
			} catch (error) {
				await this.database.proccessModel.update({ where: { id: proccess.id }, data: { failed: { push: chatId } } });
			}
		}
		const result = await this.database.proccessModel.update({
			where: { id: proccess.id },
			data: { status: 'finished', endedTime: new Date() }
		});
		if (result.receivers.length == result.failed.length) {
			throw new BadRequestException(MessageErrorMessages.WRONG_TOKEN);
		}
	}
}
