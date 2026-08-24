#!/usr/bin/env node

import { log, logTitle, logErrorAndExit } from './lib/log.mjs';
import { Pkg } from './lib/pkg.mjs';


try {
	const args = process.argv.slice(2);
	const pkg = await Pkg.createFromDisk(args[0].trim());
	const tag = await pkg.getPublishedTag();
	const changes = await pkg.getUnpublishedChanges();

	logTitle(`${pkg.name} - Unpublished Changes`);
	log(tag
		? `:::: since ${tag}`
		: ':::: no published release tagged in this repo - showing every change so far');

	for (const change of changes) {
		log(`* ${change}`);
	}

	if (!changes.length) {
		log('* none');
	}
} catch (error) {
	logErrorAndExit(error);
}

logTitle('All Done!');

