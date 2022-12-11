export interface IFileApi {
	/**
	 * Moves a file from one location to another. If the destination file already exists, it will be overwritten.
	 *
	 * eg. to rename a file
	 * ```ts
	 * moveFile('foo.txt', 'bar.txt');
	 * ```
	 *
	 * eg. to move a file
	 * ```ts
	 * moveFile('here/foo.txt', 'there/foo.txt');
	 * ```
	 *
	 * @param source The path to the file to move
	 * @param destination The new path for the file
	 * @returns true if the file was moved, false otherwise
	 */
	moveFile(source: string, destination: string): boolean;

	/**
	 * Copies a file from one location to another. If the destination file already exists, it will be overwritten.
	 *
	 * eg. to copy a file
	 * ```ts
	 * copyFile('foo.txt', 'bar.txt');
	 * ```
	 *
	 * @param source The path to the file to copy
	 * @param destination The path of the new file
	 * @returns true if the file was copied, false otherwise
	 */
	copyFile(source: string, destination: string): boolean;

	/**
	 * Checks if a file exists at the given path.
	 *
	 * eg. to check if a file exists
	 * ```ts
	 * if (fileExists('bar.txt')) {
	 *    console.log('bar.txt exists');
	 * }
	 * ```
	 *
	 * @param path The path to the file
	 * @returns true if the file exists, false otherwise
	 */
	fileExists(path: string): boolean;

	/**
	 * Deletes a file at the given path.
	 *
	 * eg. to delete a file
	 * ```ts
	 * deleteFile('bar.txt');
	 * ```
	 *
	 * @param path The path to the file
	 * @returns true if the file was deleted, false otherwise
	 */
	deleteFile(path: string): boolean;
}
