#!/usr/bin/env node

import * as path from 'node:path';
import fs from 'fs-extra';
import { createSubstitutionPtn } from './lib/create-substitution-pattern.mjs';
import { REPO_DIR, PACKAGES_DIR } from './lib/constants.mjs';
import { log, logErrorAndExit } from './lib/log.mjs';
import { Pkg } from './lib/pkg.mjs';

const README_PATH = path.join(REPO_DIR, 'README.md');
const PKGLIST_MARKER_START = '<!-- pkg-list-start -->';
const PKGLIST_MARKER_END = '<!-- pkg-list-end -->';


try {
	log(`Updating package list in top-level README...`);
	const pkgs = await getPkgs(PACKAGES_DIR);
	const listMarkdown = renderPackageList(pkgs);
	const readme = await fs.readFile(README_PATH, 'utf8');
	await fs.writeFile(README_PATH, writeDocs(readme, listMarkdown));
} catch (error){
	logErrorAndExit(error);
}

log('All Done!');

async function getPkgs(dir){
	const files = await fs.readdir(dir, { withFileTypes: true });
	const packageInfo = [];

	for (const file of files){
		if (!await file.isDirectory()){
			continue;
		}

		const { name } = file;
		const pkg = new Pkg({ name: `@bust/${name}` });

		if (!await fs.exists(pkg.jsonPath)){
			continue;
		}

		await pkg.loadJSON();
		packageInfo.push(pkg);
	}

	return packageInfo;
}

function renderPackageList(pkgs){
	const list = [];

	for (const pkg of pkgs){
		list.push(`* [${pkg.name}](${pkg.link})\n\t* ${pkg.description}`);
	}

	return list.join('\n');
}

function writeDocs(readme, docs){
	const ptn = createSubstitutionPtn(PKGLIST_MARKER_START, PKGLIST_MARKER_END);
	const fragment = `${PKGLIST_MARKER_START}\n${docs}\n${PKGLIST_MARKER_END}`;
	return readme.replace(ptn, fragment);
}

