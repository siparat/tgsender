import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { FileModule } from 'src/file/file.module';

@Module({
	imports: [FileModule],
	controllers: [ChannelController],
	providers: [ChannelService]
})
export class ChannelModule {}
