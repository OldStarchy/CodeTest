import { IFileApi } from '../../lib/IFileApi';

export abstract class BaseBackupManager {
	constructor(protected readonly api: IFileApi) {}

	abstract rollingBackup(path: string, maxBackups: string): boolean;
}
