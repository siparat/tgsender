import { IsInt, Min } from 'class-validator';

export class RunProccessDto {
	@Min(0)
	@IsInt()
	messageId: number;

	@Min(0)
	@IsInt()
	channelId: number;
}
