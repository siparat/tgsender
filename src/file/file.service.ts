import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ensureDir, writeFile, remove } from 'fs-extra';
import { randomUUID } from 'crypto';
import { join } from 'path';
import * as sharp from 'sharp';
import { FileErrorMessages, SERVE_ROOT_PATH, UPLOAD_ROOT_PATH } from './file.constants';
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

	async deleteImageFromUrl(url: string): Promise<void> {
		const filename = url.split('/').at(-1);
		if (!filename || !url.startsWith(SERVE_ROOT_PATH)) {
			throw new NotFoundException(FileErrorMessages.NOT_FOUND);
		}
		const path = join(UPLOAD_ROOT_PATH, filename);
		try {
			await remove(path);
		} catch (e) {
			throw new InternalServerErrorException('Error deleted the file: ' + e.message);
		}
	}

	private convertToAvif(buffer: Buffer): Promise<Buffer> {
		return sharp(buffer).avif({ quality: 75 }).toBuffer();
	}
}
