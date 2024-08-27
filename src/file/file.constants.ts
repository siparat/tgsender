import { path } from 'app-root-path';
import { join } from 'path';

export const UPLOAD_ROOT_PATH = join(path, 'uploads');
export const SERVE_ROOT_PATH = '/upload';

export const FileErrorMessages = {
	NOT_FOUND: 'Файл не найден'
};
