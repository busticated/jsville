#!/usr/bin/env node

import * as path from 'node:path';
import fs from 'fs-extra';
import { execa } from 'execa';
import Enquirer from 'enquirer';
import { loadTemplates } from './lib/load-templates.mjs';
import { logTitle, logErrorAndExit, logBanner } from './lib/log.mjs';
import { Pkg } from './lib/pkg.mjs';
import { Git } from './lib/git.mjs';


const cli = new Enquirer();
const git = new Git();

logBanner();
logTitle('Create a package...\n');

try {
	const pkg = await promptForPackageInfo(cli);
	const {
		changelogMD,
		indexTestTS,
		indexTS,
		licenseMD,
		packageJSON,
		readmeMD,
		tsconfigJSON
	} = await loadTemplates();

	await Promise.all([
		fs.outputFile(path.join(pkg.path, 'README.md'), readmeMD(pkg)),
		fs.outputFile(path.join(pkg.path, 'CHANGELOG.md'), changelogMD(pkg)),
		fs.outputFile(path.join(pkg.path, 'LICENSE.md'), licenseMD(pkg)),
		fs.outputFile(path.join(pkg.path, 'package.json'), packageJSON(pkg)),
		fs.outputFile(path.join(pkg.path, 'tsconfig.json'), tsconfigJSON(pkg)),
		fs.outputFile(path.join(pkg.path, 'src', 'index.test.ts'), indexTestTS(pkg)),
		fs.outputFile(path.join(pkg.path, 'src', 'index.ts'), indexTS(pkg))
	]);

	await execa('npm', ['install'], { stdio: 'inherit' }); // so root lockfile includes new package
	await execa('node', ['bin/update-readme.mjs']);
	await git.add(['README.md', 'npm-shrinkwrap.json', pkg.path]);
	await git.commit(`[${pkg.basename}] create package`);
	await git.tag(['-a', pkg.tag, '-m', pkg.tag]);

	logTitle('Success!');
	logTitle(`Your new ${pkg.name} package is located here: ${pkg.path}`);
} catch (error){
	logErrorAndExit(error);
}

logTitle('All Done!');

async function promptForPackageInfo(cli){
	const rulesMsg = 'must start with `@bust/`. only characters `a-z` and `-` are allowed.';
	const { name, description } = await cli.prompt([
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

				const pkg = new Pkg({ name });

				if (await pkg.exists()){
					return `Directory "${pkg.path}" already exists! please choose a different name.`;
				}
				return true;
			}
		},
		{
			type: 'input',
			name: 'description',
			message: 'What does your package do?',
			result: (description) => description || ''
		}
	]);

	return new Pkg({ name, description });
}

