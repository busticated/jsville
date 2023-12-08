#!/usr/bin/env node

import * as path from 'node:path';
import fs from 'fs-extra';
import { log, logErrorAndExit } from './lib/log.mjs';
import { REPO_DIR, PACKAGES_DIR } from './lib/constants.mjs';

const README_PATH = path.join(REPO_DIR, 'README.md');
const PKGLIST_MARKER_START = '<!-- pkg-list-start -->';
const PKGLIST_MARKER_END = '<!-- pkg-list-end -->';


try {
	log(`Updating package list in top-level README...`);
	const packages = await getPackages(PACKAGES_DIR);
	const listMarkdown = renderPackageList(packages);
	const readme = await fs.readFile(README_PATH, 'utf8');
	await fs.writeFile(README_PATH, writeDocs(readme, listMarkdown));
} catch (error){
	logErrorAndExit(error);
}

log('All Done!');

async function getPackages(dir){
	const files = await fs.readdir(dir, { withFileTypes: true });
	const packageInfo = [];

	for (const file of files){
		if (!await file.isDirectory()){
			continue;
		}

		const { name } = file;
		const root = path.join(dir, name);
		const link = `packages/${name}`;
		const jsonPath = path.join(root, 'package.json');
		const pkg = { name, root, link, jsonPath };

		if (!await fs.exists(pkg.jsonPath)){
			continue;
		}

		const json = await fs.readJson(pkg.jsonPath);
		packageInfo.push(Object.assign(pkg, {
			name: json.name,
			description: json.description
		}));
	}

	return packageInfo;
}

function renderPackageList(packages){
	const list = [];

	for (const { name, description, link } of packages){
		list.push(`* [${name}](${link})\n\t* ${description}`);
	}

	return list.join('\n');
}

function writeDocs(readme, docs){
	const ptn = createSubstitutionPtn(PKGLIST_MARKER_START, PKGLIST_MARKER_END);
	const fragment = `${PKGLIST_MARKER_START}\n${docs}\n${PKGLIST_MARKER_END}`;
	return readme.replace(ptn, fragment);
}

function createSubstitutionPtn(start, end){
	return new RegExp(`${start}[\\s\\S]*?${end}`, 'gmi');
}

