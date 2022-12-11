import { RealFileApi } from './RealFileApi';
import { TestFileApi } from './TestFileApi';
import { BackupManager } from './yourCode';

function createRandomString() {
	return (
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15)
	);
}

function expect(actual: any, expected: any, message?: string) {
	if (actual !== expected) {
		throw new Error(
			message || `Expected ${expected}, but got ${actual} instead.`
		);
	}
}

function expectFileWithContent(
	fileApi: TestFileApi | RealFileApi,
	name: string,
	content: string
) {
	const fileExists = fileApi.fileExists(name);

	expect(fileExists, true, `File ${name} does not exist.`);

	const fileContent = fileApi.readFile(name);

	expect(
		fileContent,
		content,
		`File ${name} content does not match expected content.`
	);
}

function expectSetEqual(
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

	for (const item of actual) {
		if (!expected.has(item)) {
			throw new Error(
				message || `Expected set to contain ${item}, but it does not.`
			);
		}
	}
}

function testBackupWithNoComplications(
	BackupManagerClass: typeof BackupManager
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
	expectFileWithContent(fileApi, backupFileName, originalContent);

	expect(result, true, 'Backup method returned false.');

	expectSetEqual(
		new Set(Object.keys(fileApi.getFiles())),
		new Set([filename, backupFileName]),
		'Unexpected files after backup.'
	);
}

function testBackupWithExistingBackup(
	BackupManagerClass: typeof BackupManager
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

	//Check
	expectFileWithContent(fileApi, filename, originalContent);
	expectFileWithContent(fileApi, firstBackupFilename, originalContent);
	expectFileWithContent(fileApi, secondBackupFilename, backupContent);

	expect(result, true, 'Backup method returned false.');

	expectSetEqual(
		new Set(Object.keys(fileApi.getFiles())),
		new Set([filename, firstBackupFilename, secondBackupFilename]),
		'Unexpected files after backup.'
	);
}

function testBackupFileThatDoesNotExist(
	BackupManagerClass: typeof BackupManager
) {
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
	expect(result, false, 'Backup method returned true.');

	expectSetEqual(
		new Set(Object.keys(fileApi.getFiles())),
		new Set([]),
		'Unexpected files after backup.'
	);
}

const tests = [
	testBackupWithNoComplications,
	testBackupWithExistingBackup,
	testBackupFileThatDoesNotExist,
];

function runTests(BackupManagerClass: typeof BackupManager) {
	let errors = false;
	tests.forEach((test) => {
		console.log(`Running test ${test.name}...`);
		console.log();

		try {
			test(BackupManagerClass);
			console.log(`Test ${test.name} passed.`);
		} catch (e: unknown) {
			errors = true;
			const message = e instanceof Error ? e.message : `${e}`;
			console.error(`Test ${test.name} failed: ${message}`);
		}
		console.log();
	});
	return !errors;
}

const ok = runTests(BackupManager);

if (!ok) {
	process.exit(1);
}
