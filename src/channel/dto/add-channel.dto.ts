import { IsString, MaxLength, MinLength } from 'class-validator';

export class AddChannelDto {
	@MaxLength(32)
	@MinLength(2)
	@IsString()
	name: string;

	avatar?: string;

	@IsString()
	token: string;
}
