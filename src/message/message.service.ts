import { Injectable } from '@nestjs/common';
import { MessageModel } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { MessageEntity } from './entities/message.entity';

@Injectable()
export class MessageService {
	constructor(private database: DatabaseService) {}

	createMessage(entity: MessageEntity): Promise<MessageModel> {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return this.database.messageModel.create({ data: entity as any });
	}

	updateMessage(id: number, entity: MessageEntity): Promise<MessageModel> {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return this.database.messageModel.update({ where: { id }, data: entity as any });
	}
}
