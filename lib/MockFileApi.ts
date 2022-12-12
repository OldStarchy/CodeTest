import clc from 'cli-color';
import { IFileApi } from './IFileApi';

/**
 * A mock file api that can be used for testing.
 *
 * Files are stored in memory and not on the disk.
 */
export class TestFileApi implements IFileApi {
	private files: Record<string, string> = {};

	static from(files: Record<string, string>): TestFileApi {
		const fileApi = new TestFileApi();
		fileApi.files = { ...files };
		return fileApi;
	}

	moveFile(source: string, destination: string): boolean {
		if (this.files[source]) {
			this.files[destination] = this.files[source];
			delete this.files[source];
			return true;
		}
		return false;
	}

	copyFile(source: string, destination: string): boolean {
		if (this.files[source]) {
			this.files[destination] = this.files[source];
			return true;
		}
		return false;
	}

	fileExists(path: string): boolean {
		return this.files[path] !== undefined;
	}

	deleteFile(path: string): boolean {
		if (this.files[path]) {
			delete this.files[path];
			return true;
		}
		return false;
	}

	createFile(path: string, content: string) {
		this.files[path] = content;
	}

	readFile(file: string) {
		return this.files[file];
	}

	getFiles() {
		return { ...this.files };
	}

	printFiles() {
		for (const file in this.files) {
			console.log(
				`${clc.yellow(file)}\n  ${clc.blackBright(
					this.files[file].split('\r').join('\r  ')
				)}`
			);
		}
	}
}
