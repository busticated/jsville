#!/usr/bin/env node

import * as path from 'node:path';
import _ from 'lodash';
import fs from 'fs-extra';
import { execa } from 'execa';
import Enquirer from 'enquirer';
import { loadTemplates } from './lib/load-templates.mjs';
import { log, logErrorAndExit, logBanner } from './lib/log.mjs';
import { PACKAGES_DIR } from './lib/constants.mjs';
import { Git } from './lib/git.mjs';


const cli = new Enquirer();
const git = new Git();

logBanner();
log('Create a package...\n');

try {
	const pkgInfo = await promptForPackageInfo(cli);
	const { name, location } = pkgInfo;
	const basename = path.basename(name);
	const tag = `${name}@0.0.0`; // TODO (busticated); get version from package.json?
	const {
		changelogMD,
		indexTestTS,
		indexTS,
		packageJSON,
		readmeMD,
		tsconfigJSON
	} = await loadTemplates();

	await Promise.all([
		fs.outputFile(path.join(location, 'README.md'), readmeMD(pkgInfo)),
		fs.outputFile(path.join(location, 'CHANGELOG.md'), changelogMD(pkgInfo)),
		fs.outputFile(path.join(location, 'package.json'), packageJSON(pkgInfo)),
		fs.outputFile(path.join(location, 'tsconfig.json'), tsconfigJSON(pkgInfo)),
		fs.outputFile(path.join(location, 'src', 'index.test.ts'), indexTestTS(pkgInfo)),
		fs.outputFile(path.join(location, 'src', 'index.ts'), indexTS(pkgInfo))
	]);

	await execa('npm', ['install'], { stdio: 'inherit' }); // so root lockfile includes new package
	await execa('node', ['bin/update-readme.mjs']);
	await git.add(['README.md', 'npm-shrinkwrap.json', location]);
	await git.commit(`[${basename}] create package`);
	await git.tag(['-a', tag, '-m', tag]);

	log('Success!');
	log(`Your new ${name} package is located here: ${location}`);
} catch (error){
	logErrorAndExit(error);
}

log('All Done!');

async function promptForPackageInfo(cli){
	const rulesMsg = 'must start with `@bust/`. only characters `a-z` and `-` are allowed.';
	const getPkgDir = (name) => path.join(PACKAGES_DIR, path.basename(name));

	const { name, description, isPrivate } = await cli.prompt([
		{
			type: 'input',
			name: 'name',
			initial: '@bust/<name>',
			message: `What is your package's name? (${rulesMsg})`,
			validate: async (name) => {
				const isValidPtn = /^@bust\/[a-z-]+$/;

				if (!isValidPtn.test(name)){
					return rulesMsg;
				}

				const dir = getPkgDir(name);

				if (await fs.pathExists(dir)){
					return `Directory "${dir}" already exists! please choose a different name.`;
				}
				return true;
			}
		},
		{
			type: 'input',
			name: 'description',
			message: 'What does your package do?',
			result: (description) => description || ''
		},
		{
			type: 'confirm',
			name: 'isPrivate',
			initial: false,
			message: 'Should this package be `private`?'
		}
	]);

	const basename = path.basename(name);
	const exports = _.camelCase(basename);
	const location = getPkgDir(name);
	return { name, basename, description, isPrivate, exports, location };
}

