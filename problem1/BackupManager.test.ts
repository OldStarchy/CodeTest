import { createRandomString } from '../lib/createRandomString';
import { TestFileApi } from '../lib/MockFileApi';
import { BackupManager } from './BackupManager';

test('Backup with no complications', () => {
	//Setup
	const filename = 'foo.txt';
	const originalContent = createRandomString();

	const backupFilename = `${filename}.1`;

	const files = TestFileApi.from({
		[filename]: originalContent,
	});

	const expectedFiles = TestFileApi.from({
		[filename]: originalContent,
		[backupFilename]: originalContent,
	});

	const backupManager = new BackupManager(files);

	//Test
	const result = backupManager.rollingBackup(filename);

	//Check
	expect(result).toBe(true);

	expect(files.getFiles()).toEqual(expectedFiles.getFiles());
});

test('Backup with existing backup', () => {
	const filename = 'foo.txt';
	const firstBackupFilename = `${filename}.1`;
	const secondBackupFilename = `${filename}.2`;
	const originalContent = createRandomString();
	const backupContent = createRandomString();

	//Setup
	const files = TestFileApi.from({
		[filename]: originalContent,
		[firstBackupFilename]: backupContent,
	});
	const expectedFiles = TestFileApi.from({
		[filename]: originalContent,
		[firstBackupFilename]: originalContent,
		[secondBackupFilename]: backupContent,
	});
	const backupManager = new BackupManager(files);

	//Test
	const result = backupManager.rollingBackup(filename);

	//Check
	expect(result).toBe(true);

	expect(files.getFiles()).toEqual(expectedFiles.getFiles());
});

test('Backup file that does not exist', () => {
	//Setup
	const filename = 'foo.txt';

	const files = TestFileApi.from({
		//No files
	});
	const expectedFiles = TestFileApi.from({
		//No files
	});
	const backupManager = new BackupManager(files);

	//Test
	const result = backupManager.rollingBackup(filename);

	//Check
	expect(result).toBe(false);

	expect(files.getFiles()).toEqual(expectedFiles.getFiles());
});

test('Test more than 9 backups', () => {
	//Setup
	const filename = 'foo.txt';
	const files = new TestFileApi();
	const expectedFiles = new TestFileApi();
	const backupManager = new BackupManager(files);

	const content = createRandomString();
	files.createFile(filename, content);
	expectedFiles.createFile(filename, content);
	expectedFiles.createFile(`${filename}.1`, content);

	for (let i = 1; i <= 10; i++) {
		const content = createRandomString();
		files.createFile(`${filename}.${i}`, content);
		expectedFiles.createFile(`${filename}.${i + 1}`, content);
	}

	//Test
	const result = backupManager.rollingBackup(filename);

	//Check
	expect(result).toBe(true);

	expect(files.getFiles()).toEqual(expectedFiles.getFiles());
});

test('Test backing up a file that already has a numerical suffix', () => {
	//Setup
	const filename = 'foo.txt.1';
	const content = createRandomString();
	const backupFileName = `${filename}.1`;
	const files = TestFileApi.from({
		[filename]: content,
	});
	const expectedFiles = TestFileApi.from({
		[filename]: content,
		[backupFileName]: content,
	});
	const backupManager = new BackupManager(files);

	//Test
	const result = backupManager.rollingBackup(filename);

	//Check
	expect(result).toBe(true);

	expect(files.getFiles()).toEqual(expectedFiles.getFiles());
});
