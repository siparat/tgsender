import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User } from 'telegraf/types';
import { CommonMessage, IContext, IExtractedMessage } from './bot.interfaces';
import { MessageEntity } from 'src/message/entities/message.entity';
import {
	isAnimationMessage,
	isAudioMessage,
	isDocumentMessage,
	isPhotoMessage,
	isTextMessage,
	isVideoMessage,
	isVoiceMessage
} from 'src/typeguards/message.typeguards';
import { MessageType } from '@prisma/client';
import { BotStaticMessages } from './bot.constants';
import { MessageService } from 'src/message/message.service';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { MessageErrorMessages } from '../message/message.constants';

@Injectable()
export class BotService {
	constructor(
		private database: DatabaseService,
		private messageService: MessageService,
		@InjectBot() private bot: Telegraf
	) {}

	async createMessage(ctx: IContext, message: CommonMessage, sender: User): Promise<void> {
		const extractedMessage = this.extractValueFromMessage(message);
		if (!extractedMessage) {
			await ctx.reply(BotStaticMessages.UNPROCCESSED_MESSAGE);
			return;
		}
		const { key, value, caption, entities } = extractedMessage;
		const entity = new MessageEntity({ userTgId: sender.id, text: caption, [key]: value, entities, type: key });
		const createdMessage = await this.messageService.createMessage(entity);
		await ctx.reply(BotStaticMessages.MESSAGE_CREATED);
		ctx.session.awaitingNameMessage = createdMessage.id;
	}

	async setName(ctx: IContext, id: number, name: string): Promise<void> {
		ctx.session.awaitingNameMessage = undefined;
		const message = await this.database.messageModel.findUnique({ where: { id } });
		if (!message) {
			ctx.reply(BotStaticMessages.NOT_FOUND);
			return;
		}
		const entity = new MessageEntity({ ...message, label: name });
		await this.messageService.updateMessage(id, entity);
		await ctx.reply(BotStaticMessages.LABEL_SAVED);
	}

	async sendMessage(chatId: number, message: MessageEntity): Promise<void> {
		if (message.text) {
			await this.bot.telegram.sendMessage(chatId, message.text, { entities: message.entities });
			return;
		}
		const extra = {
			caption: message.text,
			caption_entities: message.entities
		};

		if (message.animation) {
			await this.bot.telegram.sendAnimation(chatId, message.animation.file_id, extra);
			return;
		}
		if (message.audio) {
			await this.bot.telegram.sendAudio(chatId, message.audio.file_id, extra);
			return;
		}
		if (message.document) {
			await this.bot.telegram.sendDocument(chatId, message.document.file_id, extra);
			return;
		}
		if (message.photo) {
			await this.bot.telegram.sendPhoto(chatId, message.photo[message.photo.length - 1].file_id, extra);
			return;
		}
		if (message.video) {
			await this.bot.telegram.sendVideo(chatId, message.video.file_id, extra);
			return;
		}
		if (message.voice) {
			await this.bot.telegram.sendVoice(chatId, message.voice.file_id, extra);
			return;
		}
		throw new BadRequestException(MessageErrorMessages.EMPTY_MESSAGE);
	}

	private extractValueFromMessage(message: CommonMessage): IExtractedMessage | null {
		const config = [
			{ func: isTextMessage, key: MessageType.text },
			{ func: isPhotoMessage, key: MessageType.photo },
			{ func: isVideoMessage, key: MessageType.video },
			{ func: isAudioMessage, key: MessageType.audio },
			{ func: isDocumentMessage, key: MessageType.document },
			{ func: isAnimationMessage, key: MessageType.animation },
			{ func: isVoiceMessage, key: MessageType.voice }
		];

		for (const { func, key } of config) {
			if (!func(message)) {
				continue;
			}
			const entities = 'text' in message ? message.entities : message.caption_entities;
			const caption = 'text' in message ? undefined : message.caption;
			return { key, value: Array.isArray(message[key]) ? message[key].at(-1) : message[key], entities, caption };
		}
		return null;
	}
}
