import { IBackupManager } from './IBackupManager';
import { IFileApi } from './IFileApi';

export abstract class BaseBackupManager implements IBackupManager {
	constructor(protected readonly api: IFileApi) {}

	abstract backup(path: string): boolean;
}
