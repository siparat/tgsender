import { Ctx, Message, On, Sender, Start, Update } from 'nestjs-telegraf';
import { BotStaticMessages } from './bot.constants';
import { User } from 'telegraf/types';
import { UserService } from 'src/user/user.service';
import { BotService } from './bot.service';
import { isUUID } from 'class-validator';
import { DatabaseService } from 'src/database/database.service';
import { CommonMessage, IContext } from './bot.interfaces';
import { UserEntity } from 'src/user/entities/user.entity';

@Update()
export class BotUpdate {
	constructor(
		private userService: UserService,
		private botService: BotService,
		private database: DatabaseService
	) {}

	@Start()
	onStart(@Ctx() ctx: IContext): void {
		ctx.reply(BotStaticMessages.START);
	}

	@On('message')
	async onMessage(@Ctx() ctx: IContext, @Message() msg: CommonMessage, @Sender() sender: User): Promise<void> {
		if (ctx.session.awaitingNameMessage) {
			ctx.text && (await this.botService.setName(ctx, ctx.session.awaitingNameMessage, ctx.text));
			return;
		}
		const user = await this.userService.findByTgId(sender.id);
		if (user) {
			await this.botService.createMessage(ctx, msg, sender);
			return;
		}
		const token = ctx.text;
		if (!token || !isUUID(ctx.text)) {
			await ctx.reply(BotStaticMessages.WRONG_FORMAT_TOKEN);
			return;
		}
		const userByToken = await this.userService.findByToken(token);
		if (!userByToken) {
			await ctx.reply(BotStaticMessages.USER_NOT_FOUND_BY_TOKEN);
			return;
		}
		const entity = new UserEntity({ ...userByToken, tgId: sender.id });
		await this.database.userModel.update({ where: { token }, data: entity });
		await ctx.reply(BotStaticMessages.REGISTERED);
		return;
	}
}
