#!/usr/bin/env node

import { log, logTitle, logErrorAndExit } from './lib/log.mjs';
import { Pkg } from './lib/pkg.mjs';


try {
	const args = process.argv.slice(2);
	const pkg = await Pkg.createFromDisk(args[0].trim());
	const changes = await pkg.getUnpublishedChanges();

	logTitle(`${pkg.name} - Unpublished Changes`);

	for (const change of changes) {
		log(`* ${change}`);
	}
} catch (error) {
	logErrorAndExit(error);
}

logTitle('All Done!');

