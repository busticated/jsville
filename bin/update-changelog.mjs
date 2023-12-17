#!/usr/bin/env node

import { logTitle, logErrorAndExit } from './lib/log.mjs';
import { Pkg } from './lib/pkg.mjs';
import { Git } from './lib/git.mjs';


try {
	const args = process.argv.slice(2);
	const git = new Git();
	const pkg = await Pkg.createFromDisk(args[0].trim());
	const changes = await pkg.getUnpublishedChanges();
	logTitle(`${pkg.name} - Updating Changelog...`);
	await pkg.addChangelogEntry(changes);
	await git.add([pkg.changelogPath]);
} catch (error) {
	logErrorAndExit(error);
}

logTitle('All Done!');

