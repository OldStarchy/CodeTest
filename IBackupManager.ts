import { IFileApi } from './IFileApi';

export interface IBackupManager {
	backup(path: string): boolean;
}

export interface IBackupManagerStatic {
	new (api: IFileApi): IBackupManager;
}

export abstract class BaseBackupManager implements IBackupManager {
	constructor(private readonly api: IFileApi) {}

	abstract backup(path: string): boolean;
}
