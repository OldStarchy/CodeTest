interface PasswordOptions {
	useLowercase?: boolean;
	useUppercase?: boolean;
	useNumbers?: boolean;
	useSymbols?: boolean;
	length?: number;
	avoidAmbiguous?: boolean;
	seed?: number;
}

export function generatePassword({
	useLowercase = true,
	useUppercase = true,
	useNumbers = true,
	useSymbols = true,
	length = 8,
	avoidAmbiguous = true,
	seed = Math.random(),
}: PasswordOptions = {}): string {
	throw new Error('Not implemented');
}
