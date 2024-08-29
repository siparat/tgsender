import {
	BadRequestException,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Post,
	UseGuards
} from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageModel, UserModel } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { DatabaseService } from 'src/database/database.service';
import { MessageErrorMessages } from './message.constants';

@Controller('message')
export class MessageController {
	constructor(
		private readonly messageService: MessageService,
		private database: DatabaseService
	) {}

	@UseGuards(JwtAuthGuard)
	@Get('all')
	getAll(@User() user: UserModel): Promise<MessageModel[]> {
		return this.database.messageModel.findMany({ where: { user: { id: user.id } } });
	}

	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	@Post('preview/:id')
	async previewMessage(@Param('id', ParseIntPipe) id: number, @User() user: UserModel): Promise<void> {
		if (!user.tgId) {
			throw new BadRequestException(MessageErrorMessages.TG_ID_IS_NULL);
		}
		await this.messageService.previewMessage(id, user.tgId);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	deleteById(@Param('id', ParseIntPipe) id: number, @User() user: UserModel): Promise<MessageModel> {
		return this.messageService.deleteMessage(id, user.tgId);
	}
}
