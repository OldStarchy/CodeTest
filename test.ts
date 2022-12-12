import clc from 'cli-color';
import { BackupManager } from './BackupManager';
import { FileApi } from './lib/FileApi';
import { IBackupManagerStatic } from './lib/IBackupManagerStatic';
import { TestFileApi } from './lib/MockFileApi';

function createRandomString() {
	return (
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15)
	);
}

class TestBase {
	constructor(
		private readonly name: string,
		private readonly test: (
			this: TestBase,
			BackupManagerClass: IBackupManagerStatic
		) => void
	) {}

	run(BackupManagerClass: IBackupManagerStatic) {
		console.log(clc.blue(this.name));
		try {
			this.test(BackupManagerClass);
			console.log(clc.green(`✔ Test ${this.name} passed.`));
			return true;
		} catch (e: unknown) {
			const message = e instanceof Error ? e.message : `${e}`;
			console.log(
				`${clc.red('❌')} Test ${this.name} failed: ${message}`
			);

			if (e instanceof Error) {
				console.log(e.stack);
			}
			return false;
		}
	}

	expect(actual: any, expected: any, message?: string) {
		if (actual !== expected) {
			throw new Error(
				message || `Expected ${expected}, but got ${actual} instead.`
			);
		}
	}

	expectFileWithContent(
		fileApi: TestFileApi | FileApi,
		name: string,
		content: string
	) {
		const fileExists = fileApi.fileExists(name);

		this.expect(fileExists, true, `File ${name} does not exist.`);

		const fileContent = fileApi.readFile(name);

		this.expect(
			fileContent,
			content,
			`File ${name} content does not match expected content.`
		);
	}

	expectSetEqual(
		actual: Set<string>,
		expected: Set<string>,
		message?: string
	) {
		if (actual.size !== expected.size) {
			throw new Error(
				message ||
					`Expected set of size ${expected.size}, but got set of size ${actual.size} instead.`
			);
		}

		for (const item of Array.from(actual)) {
			if (!expected.has(item)) {
				throw new Error(
					message ||
						`Expected set to contain ${item}, but it does not.`
				);
			}
		}
	}

	expectObjectEqual(
		actual: Record<string, any>,
		expected: Record<string, any>,
		message?: string
	) {
		const actualKeys = Object.keys(actual);
		const expectedKeys = Object.keys(expected);

		this.expectSetEqual(
			new Set(actualKeys),
			new Set(expectedKeys),
			message
		);

		for (const key of actualKeys) {
			this.expect(
				actual[key],
				expected[key],
				message ||
					`Expected property ${key} to be ${expected[key]}, but got ${actual[key]} instead.`
			);
		}
	}
}

const tests: TestBase[] = [];

tests.push(
	new TestBase('Backup with no complications', function (
		BackupManagerClass: IBackupManagerStatic
	) {
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
		this.expect(result, true, 'Backup method returned false.');

		this.expectObjectEqual(files.getFiles(), expectedFiles.getFiles());
	})
);

tests.push(
	new TestBase('Backup with existing backup', function (
		BackupManagerClass: IBackupManagerStatic
	) {
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
		this.expect(result, true, 'Backup method returned false.');

		this.expectObjectEqual(files.getFiles(), expectedFiles.getFiles());
	})
);

tests.push(
	new TestBase(
		'Backup file that does not exist',

		function (BackupManagerClass: IBackupManagerStatic) {
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
			this.expect(result, false, 'Backup method returned true.');

			this.expectObjectEqual(files.getFiles(), expectedFiles.getFiles());
		}
	)
);

tests.push(
	new TestBase(
		'Test more than 9 backups',

		function (BackupManagerClass: IBackupManagerStatic) {
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
			this.expect(result, true, 'Backup method returned false.');

			this.expectObjectEqual(files.getFiles(), expectedFiles.getFiles());
		}
	)
);

function runTests(BackupManagerClass: IBackupManagerStatic) {
	let ok = true;
	tests.forEach((test) => {
		ok = test.run(BackupManagerClass) && ok;
		console.log();
	});
	return ok;
}

const ok = runTests(BackupManager);

if (!ok) {
	console.log('tests failed');
	process.exit(1);
} else {
	console.log('tests passed');
}
