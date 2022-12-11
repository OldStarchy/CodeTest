import { IFileApi } from './IFileApi';

export interface IBackupManager {
	backup(path: string): boolean;
}

export interface IBackupManagerStatic {
	new (api: IFileApi): IBackupManager;
}
