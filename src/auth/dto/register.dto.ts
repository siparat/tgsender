import { IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
	@MaxLength(32)
	@MinLength(2)
	@IsString()
	login: string;

	@MaxLength(32)
	@MinLength(8)
	@IsString()
	password: string;
}
