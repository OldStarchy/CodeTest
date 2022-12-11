import { IFileApi } from './IFileApi';

export class BackupManager {
	constructor(private readonly api: IFileApi) {}

	backup(path: string): boolean {
		// your code here
		throw new Error('Not implemented');
	}
}
