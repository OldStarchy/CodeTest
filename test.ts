import clc from 'cli-color';
import { IBackupManagerStatic } from './IBackupManager';
import { RealFileApi } from './RealFileApi';
import { TestFileApi } from './TestFileApi';
import { BackupManager } from './yourCode';

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
		fileApi: TestFileApi | RealFileApi,
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
		const fileApi = new TestFileApi();
		const backupManager = new BackupManagerClass(fileApi);

		//Setup
		const filename = 'foo.txt';
		const originalContent = createRandomString();

		fileApi.createFile(filename, originalContent);

		console.log('Starting test with files');
		fileApi.printFiles();
		console.log();

		//Test
		console.log(`Creating backup of ${filename}`);
		const result = backupManager.backup(filename);

		console.log('After backup');
		fileApi.printFiles();

		//Check
		const backupFileName = `${filename}.1`;
		this.expectFileWithContent(fileApi, backupFileName, originalContent);

		this.expect(result, true, 'Backup method returned false.');

		this.expectSetEqual(
			new Set(Object.keys(fileApi.getFiles())),
			new Set([filename, backupFileName]),
			'Unexpected files after backup.'
		);
	})
);

tests.push(
	new TestBase('Backup with existing backup', function (
		BackupManagerClass: IBackupManagerStatic
	) {
		const fileApi = new TestFileApi();
		const backupManager = new BackupManagerClass(fileApi);

		//Setup
		const filename = 'foo.txt';
		const firstBackupFilename = `${filename}.1`;
		const secondBackupFilename = `${filename}.2`;
		const originalContent = createRandomString();
		const backupContent = createRandomString();

		fileApi.createFile(filename, originalContent);
		fileApi.createFile(firstBackupFilename, backupContent);

		console.log('Starting test with files');
		fileApi.printFiles();
		console.log();

		//Test
		console.log(`Creating backup of ${filename}`);
		const result = backupManager.backup(filename);

		console.log('After backup');
		fileApi.printFiles();

		//Check
		this.expectFileWithContent(fileApi, filename, originalContent);
		this.expectFileWithContent(
			fileApi,
			firstBackupFilename,
			originalContent
		);
		this.expectFileWithContent(
			fileApi,
			secondBackupFilename,
			backupContent
		);

		this.expect(result, true, 'Backup method returned false.');

		this.expectSetEqual(
			new Set(Object.keys(fileApi.getFiles())),
			new Set([filename, firstBackupFilename, secondBackupFilename]),
			'Unexpected files after backup.'
		);
	})
);

tests.push(
	new TestBase(
		'Backup file that does not exist',

		function (BackupManagerClass: IBackupManagerStatic) {
			const fileApi = new TestFileApi();
			const backupManager = new BackupManagerClass(fileApi);

			//Setup
			const filename = 'foo.txt';

			console.log('Starting test with files');
			fileApi.printFiles();
			console.log();

			//Test
			console.log(`Creating backup of ${filename}`);
			const result = backupManager.backup(filename);

			console.log('After backup');
			fileApi.printFiles();

			//Check
			this.expect(result, false, 'Backup method returned true.');

			this.expectSetEqual(
				new Set(Object.keys(fileApi.getFiles())),
				new Set([]),
				'Unexpected files after backup.'
			);
		}
	)
);

tests.push(
	new TestBase(
		'Test more than 9 backups',

		function (BackupManagerClass: IBackupManagerStatic) {
			const fileApi = new TestFileApi();
			const expectedFiles = new TestFileApi();
			const backupManager = new BackupManagerClass(fileApi);

			//Setup
			const filename = 'foo.txt';

			const content = createRandomString();
			fileApi.createFile(filename, content);
			expectedFiles.createFile(filename, content);
			expectedFiles.createFile(`${filename}.1`, content);

			for (let i = 1; i <= 10; i++) {
				const content = createRandomString();
				fileApi.createFile(`${filename}.${i}`, content);
				expectedFiles.createFile(`${filename}.${i + 1}`, content);
			}

			console.log('Starting test with files');
			fileApi.printFiles();
			console.log();

			//Test
			console.log(`Creating backup of ${filename}`);
			const result = backupManager.backup(filename);

			console.log('After backup');
			fileApi.printFiles();

			//Check
			this.expect(result, true, 'Backup method returned false.');

			this.expectObjectEqual(
				fileApi.getFiles(),
				expectedFiles.getFiles(),
				'Unexpected files after backup.'
			);
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
