import { MessageModel } from '@prisma/client';
import { PartialFields } from '../../types/partial-fields';
import { MessageEntity as Message } from 'telegraf/types';

export type IMessageEntity = Omit<
	PartialFields<
		MessageModel,
		'id' | 'text' | 'document' | 'photo' | 'video' | 'entities' | 'animation' | 'audio' | 'voice' | 'label'
	>,
	'entities'
> & { entities?: MessageModel['entities'] | Message.AbstractMessageEntity[] };
