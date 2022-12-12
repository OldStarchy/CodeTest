import fs from 'fs';
import { IFileApi } from './IFileApi';

export class FileApi implements IFileApi {
	moveFile(source: string, destination: string): boolean {
		try {
			fs.renameSync(source, destination);
			return true;
		} catch (e) {
			return false;
		}
	}

	copyFile(source: string, destination: string): boolean {
		try {
			fs.copyFileSync(source, destination);
			return true;
		} catch (e) {
			return false;
		}
	}

	fileExists(path: string): boolean {
		return fs.existsSync(path);
	}

	deleteFile(path: string): boolean {
		try {
			fs.unlinkSync(path);
			return true;
		} catch (e) {
			return false;
		}
	}

	createFile(path: string, content: string) {
		fs.writeFileSync(path, content);
	}

	readFile(file: string) {
		return fs.readFileSync(file, 'utf-8');
	}
}
