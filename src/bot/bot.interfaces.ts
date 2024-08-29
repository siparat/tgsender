import { Message, MessageEntity as Entity } from 'telegraf/types';
import { MessageType } from '@prisma/client';
import { Context } from 'telegraf';

export type CommonMessage =
	| Message.AudioMessage
	| Message.VideoMessage
	| Message.DocumentMessage
	| Message.VoiceMessage
	| Message.AnimationMessage
	| Message.PhotoMessage
	| Message.TextMessage;

export interface IExtractedMessage {
	key: MessageType;
	value: Record<string, unknown>;
	caption?: string;
	entities?: Entity.AbstractMessageEntity[];
}

export interface ISession {
	awaitingNameMessage?: number;
}

export interface IContext extends Context {
	session: ISession;
}
