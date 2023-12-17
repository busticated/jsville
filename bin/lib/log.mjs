export const log = (message) => {
	console.log(message); // eslint-disable-line no-console
};

export const logTitle = (message) => {
	log(`:::: ${message}`); // eslint-disable-line no-console
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
		''
	].forEach(log);
};

export const logErrorAndExit = (error, code = 1) => {
	/* eslint-disable no-console */
	console.error(':::: Whoops!');
	console.error(error);
	return process.exit(code);
	/* eslint-enable no-console */
};

