import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { MessageModel } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { MessageEntity } from './entities/message.entity';
import { MessageErrorMessages } from './message.constants';
import { BotService } from 'src/bot/bot.service';

@Injectable()
export class MessageService {
	constructor(
		private database: DatabaseService,
		private bot: BotService
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
		await this.bot.sendMessage(userTgId, entity);
	}
}
