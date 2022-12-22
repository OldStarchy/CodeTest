
import {BackupManager} from './BackupManager';
import {IBackupManagerStatic} from './lib/IBackupManagerStatic';
import {TestFileApi} from './lib/MockFileApi';

function createRandomString() {
	return (
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15)
	);
}
const testBackupManager = describe.each([
	[BackupManager],
]);

testBackupManager('Backup with no complications', (BackupManagerClass) => {
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

	const backupManager = new BackupManagerClass(files);

	console.log('Starting test with files');
	files.printFiles();
	console.log();

	//Test
	console.log(`Creating backup of ${filename}`);
	const result = backupManager.backup(filename);

	console.log('After backup');
	files.printFiles();

	//Check
	expect(result).toBe(true);

	expect(files.getFiles()).toEqual(expectedFiles.getFiles());
});

testBackupManager('Backup with existing backup', (
		BackupManagerClass: IBackupManagerStatic
	) => {
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
		const backupManager = new BackupManagerClass(files);

		console.log('Starting test with files');
		files.printFiles();
		console.log();

		//Test
		console.log(`Creating backup of ${filename}`);
		const result = backupManager.backup(filename);

		console.log('After backup');
		files.printFiles();

		//Check
		expect(result).toBe(true);

		expect(files.getFiles()).toEqual(expectedFiles.getFiles());
	});

testBackupManager('Backup file that does not exist',

		 (BackupManagerClass: IBackupManagerStatic) => {
			//Setup
			const filename = 'foo.txt';

			const files = TestFileApi.from({
				//No files
			});
			const expectedFiles = TestFileApi.from({
				//No files
			});
			const backupManager = new BackupManagerClass(files);

			console.log('Starting test with files');
			files.printFiles();
			console.log();

			//Test
			console.log(`Creating backup of ${filename}`);
			const result = backupManager.backup(filename);

			console.log('After backup');
			files.printFiles();

			//Check
			expect(result).toBe(false);

			expect(files.getFiles()).toEqual(expectedFiles.getFiles());
		}
	);

testBackupManager(
		'Test more than 9 backups',

 (BackupManagerClass: IBackupManagerStatic) =>{
			//Setup
			const filename = 'foo.txt';
			const files = new TestFileApi();
			const expectedFiles = new TestFileApi();
			const backupManager = new BackupManagerClass(files);

			const content = createRandomString();
			files.createFile(filename, content);
			expectedFiles.createFile(filename, content);
			expectedFiles.createFile(`${filename}.1`, content);

			for (let i = 1; i <= 10; i++) {
				const content = createRandomString();
				files.createFile(`${filename}.${i}`, content);
				expectedFiles.createFile(`${filename}.${i + 1}`, content);
			}

			console.log('Starting test with files');
			files.printFiles();
			console.log();

			//Test
			console.log(`Creating backup of ${filename}`);
			const result = backupManager.backup(filename);

			console.log('After backup');
			files.printFiles();

			//Check
			expect(result).toBe(true);

			expect(files.getFiles()).toEqual(expectedFiles.getFiles());
		}
);

testBackupManager(
		'Test backing up a file that already has a numerical suffix',
		(BackupManagerClass: IBackupManagerStatic) => {
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
			const backupManager = new BackupManagerClass(files);

			console.log('Starting test with files');
			files.printFiles();
			console.log();

			//Test
			console.log(`Creating backup of ${filename}`);
			const result = backupManager.backup(filename);

			console.log('After backup');
			files.printFiles();

			//Check
			expect(result).toBe(true);

			expect(files.getFiles()).toEqual(expectedFiles.getFiles());
		}
);
