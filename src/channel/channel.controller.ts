import {
	Body,
	Controller,
	Delete,
	FileTypeValidator,
	ForbiddenException,
	Get,
	MaxFileSizeValidator,
	NotFoundException,
	Param,
	ParseFilePipe,
	ParseIntPipe,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { AddChannelDto } from './dto/add-channel.dto';
import { User } from 'src/decorators/user.decorator';
import { ChannelModel, UserModel } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChannelService } from './channel.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';
import { DatabaseService } from 'src/database/database.service';
import { ChannelErrorMssages } from './channel.constants';

@Controller('channel')
export class ChannelController {
	constructor(
		private channelService: ChannelService,
		private fileService: FileService,
		private database: DatabaseService
	) {}

	@UseInterceptors(FileInterceptor('avatar'))
	@UsePipes(ValidationPipe)
	@UseGuards(JwtAuthGuard)
	@Post('add')
	async addChannel(
		@Body() dto: AddChannelDto,
		@User() user: UserModel,
		@UploadedFile(
			new ParseFilePipe({
				validators: [new FileTypeValidator({ fileType: 'image' }), new MaxFileSizeValidator({ maxSize: 1.5 * 1024 * 1024 })]
			})
		)
		file: Express.Multer.File
	): Promise<ChannelModel> {
		const { url } = await this.fileService.saveImage(file);
		dto.avatar = url;
		return this.channelService.addChannel(dto, user.id);
	}

	@UseGuards(JwtAuthGuard)
	@Get('all')
	async getAll(@User() user: UserModel): Promise<ChannelModel[]> {
		return this.database.channelModel.findMany({ where: { userId: user.id } });
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async getById(@Param('id', ParseIntPipe) id: number, @User() user: UserModel): Promise<ChannelModel> {
		const channel = await this.database.channelModel.findUnique({ where: { id } });
		if (!channel) {
			throw new NotFoundException(ChannelErrorMssages.NOT_FOUND);
		}
		if (channel.userId !== user.id) {
			throw new ForbiddenException(ChannelErrorMssages.FORBIDDEN);
		}
		return channel;
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async deleteChannel(@Param('id', ParseIntPipe) id: number, @User() user: UserModel): Promise<ChannelModel> {
		return this.channelService.deleteChannel(id, user.id);
	}
}
