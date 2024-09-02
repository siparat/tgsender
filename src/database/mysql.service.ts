import { Inject, Injectable, Logger } from '@nestjs/common';
import { DatabaseProvideKeys } from './database.constants';
import { Pool } from 'mysql2/promise';

interface GetChatsIdResponse {
	chat_id: bigint;
}

@Injectable()
export class MySqlService {
	constructor(@Inject(DatabaseProvideKeys.MY_SQL) private pool: Pool) {}

	async getChatsId(): Promise<bigint[]> {
		const connection = await this.pool.getConnection();
		try {
			const [response] = await connection.query(`
			SELECT DISTINCT chat_id
			FROM chat_history
		`);
			return (response as GetChatsIdResponse[]).map(({ chat_id }) => chat_id);
		} catch (error) {
			Logger.error(error);
			return [];
		} finally {
			connection.release();
		}
	}
}
