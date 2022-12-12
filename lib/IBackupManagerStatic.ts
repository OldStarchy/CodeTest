import { IBackupManager } from './IBackupManager';
import { IFileApi } from './IFileApi';

export interface IBackupManagerStatic {
	new (api: IFileApi): IBackupManager;
}
