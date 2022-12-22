/**
 * Parses a command line into an array of arguments.
 * eg. "command arg1 arg2" -> ["command", "arg1", "arg2"]
 *
 * Single quotes are used to escape spaces.
 * eg. "command 'arg 1' arg2" -> ["command", "arg 1", "arg2"]
 *
 * A backslash can be used to escape a single quote, both inside and outside
 * of quoted strings.
 * eg. "command arg\'1 arg2" -> ["command", "arg'1", "arg2"]
 * eg. "command 'arg \'1\'' arg2" -> ["command", "arg '1'", "arg2"]
 *
 * @param commandLine The command line to parse.
 * @returns An array of arguments.
 */
export function parseArguments(commandLine: string): string[] {
	throw new Error('Not implemented');
}
