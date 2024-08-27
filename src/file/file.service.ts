import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ensureDir, writeFile } from 'fs-extra';
import { randomUUID } from 'crypto';
import { join } from 'path';
import * as sharp from 'sharp';
import { SERVE_ROOT_PATH, UPLOAD_ROOT_PATH } from './file.constants';
import { FileResponse } from './file.interfaces';

@Injectable()
export class FileService {
	constructor() {
		ensureDir(UPLOAD_ROOT_PATH);
	}

	async saveImage(file: Express.Multer.File): Promise<FileResponse> {
		try {
			const filename = randomUUID() + '.avif';
			const path = join(UPLOAD_ROOT_PATH, filename);
			const buffer = await this.convertToAvif(file.buffer);
			await writeFile(path, buffer);
			return { url: join(SERVE_ROOT_PATH, filename) };
		} catch (e) {
			throw new InternalServerErrorException('Error writing the file: ' + e.message);
		}
	}
	private convertToAvif(buffer: Buffer): Promise<Buffer> {
		return sharp(buffer).avif({ quality: 75 }).toBuffer();
	}
}
