export const log = (message) => {
	console.log(message);
};

export const logTitle = (message) => {
	log(`:::: ${message}`);
};

// https://patorjk.com/software/taag/#p=display&f=Ivrit&t=JSVille
export const logBanner = () => {
	[
		'',
		'      _ ______     ___ _ _      ',
		'     | / ___\\ \\   / (_) | | ___ ',
		'  _  | \\___ \\\\ \\ / /| | | |/ _ \\',
		' | |_| |___) |\\ V / | | | |  __/',
		'  \\___/|____/  \\_/  |_|_|_|\\___|',
		'',
	].forEach(log);
};

export const logErrorAndExit = (error, code = 1) => {
	console.error(':::: Whoops!');
	console.error(error);
	return process.exit(code);
};

