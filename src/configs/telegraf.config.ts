import { ConfigService } from '@nestjs/config';
import { TelegrafModuleOptions } from 'nestjs-telegraf';
import { ISession } from 'src/bot/bot.interfaces';
import { Context, session } from 'telegraf';

export const getTelegrafConfig = (config: ConfigService): TelegrafModuleOptions => ({
	token: config.get('BOT') ?? '',
	middlewares: [session<ISession, Context>({ defaultSession: () => ({ awaitingNameMessage: undefined }) })]
});
