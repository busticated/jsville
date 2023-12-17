#!/usr/bin/env node

import { logTitle, logErrorAndExit } from './lib/log.mjs';
import { Pkg } from './lib/pkg.mjs';
import { Git } from './lib/git.mjs';


try {
	const args = process.argv.slice(2);
	const git = new Git();
	const pkg = await Pkg.createFromDisk(args[0].trim());
	logTitle(`${pkg.name} - Updating README...`);
	await pkg.updateReadmeDocsLink(encodeURIComponent(pkg.tag));
	await git.add([pkg.readmePath, pkg.docsPath]);
} catch (error) {
	logErrorAndExit(error);
}

logTitle('All Done!');

