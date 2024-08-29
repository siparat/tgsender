/* eslint-disable @typescript-eslint/no-explicit-any */
import { Message } from 'telegraf/types';
import { IMessageEntity } from '../message.interfaces';
import { MessageType } from '@prisma/client';

export class MessageEntity {
	id?: number;
	userTgId: number;
	label?: string;

	text?: string;
	entities?: any[];
	photo?: Message.PhotoMessage['photo'];
	audio?: Message.AudioMessage['audio'];
	video?: Message.VideoMessage['video'];
	animation?: Message.AnimationMessage['animation'];
	voice?: Message.VoiceMessage['voice'];
	document?: Message.DocumentMessage['document'];
	type: MessageType;

	constructor(message: IMessageEntity) {
		this.id = message.id;
		this.userTgId = message.userTgId;
		this.label = message.label || undefined;

		this.text = message.text || undefined;
		this.entities = message.entities as any;
		this.photo = message.photo as any;
		this.audio = message.audio as any;
		this.video = message.video as any;
		this.animation = message.animation as any;
		this.voice = message.voice as any;
		this.document = message.document as any;
		this.type = message.type;
	}
}
