import { BaseBackupManager } from './lib/BaseBackupManager';

export class BackupManager extends BaseBackupManager {
	/**
	 * Renames a file to a backup location.
	 *
	 * The backup location is in the same directory as the original file,
	 * but the backup will have a numerical suffix appended to the name.
	 * eg. "file.txt" -> "file.txt.1"
	 *
	 * When a file already exists at the backup location, it will be renamed
	 * with the next available suffix.
	 * eg. "file.txt.1" -> "file.txt.2", "file.txt.2" -> "file.txt.3"
	 *
	 * The maximum number of backups to keep is specified by the maxBackups
	 * parameter.
	 *
	 * This way the lowest numbered backup is the most recent.
	 *
	 * This is primarily used to keep log files from getting too big.
	 *
	 * @param file The file to backup.
	 * @param maxBackups The maximum number of backups to keep.
	 * @returns True if the backup was successful, false otherwise.
	 * @throws Error if the file does not exist or could not be read
	 */
	rollingBackup(path: string, maxBackups: string): boolean {
		// your code here
		throw new Error('Not implemented');
	}
}
