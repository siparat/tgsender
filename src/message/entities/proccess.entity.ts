import { ProccessStatus } from '@prisma/client';
import { IProccessEntity } from '../message.interfaces';

export class ProccessEntity {
	id?: number;
	createdAt?: Date;
	endedTime?: Date;
	messageId: number;
	userId: number;
	receivers: bigint[];
	failed: bigint[];
	status: ProccessStatus;
	channelId: number;

	constructor(proccess: IProccessEntity) {
		this.id = proccess.id;
		this.createdAt = proccess.createdAt;
		this.endedTime = proccess.endedTime ?? undefined;
		this.messageId = proccess.messageId;
		this.userId = proccess.userId;
		this.receivers = proccess.receivers;
		this.failed = proccess.failed;
		this.status = proccess.status;
		this.channelId = proccess.channelId;
	}
}
