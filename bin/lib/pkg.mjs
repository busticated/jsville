import * as path from 'node:path';
import _ from 'lodash';
import fs from 'fs-extra';
import { execa } from 'execa';
import { createSubstitutionPtn } from './create-substitution-pattern.mjs';
import { PACKAGES_DIR } from './constants.mjs';
import { Git } from './git.mjs';

const CHGLOG_MARKER_START = '<!-- next-version-start -->';
const CHGLOG_MARKER_END = '<!-- next-version-end -->';
const README_MARKER_START = '<!-- api-docs-start -->';
const README_MARKER_END = '<!-- api-docs-end -->';



export class Pkg {
	static async createFromDisk(name) {
		const pkg = new Pkg({ name });
		await pkg.loadJSON();
		return pkg;
	}

	constructor({ name, description, version, isPrivate } = {}) {
		this.name = name;
		this.description = description || '';
		this.version = version || '0.0.0';
		this.isPrivate = isPrivate || false;
		this.basename = path.basename(this.name);
		this.link = path.join(path.basename(PACKAGES_DIR), this.basename);
		this.exportName = _.camelCase(this.basename);
		this.path = path.join(PACKAGES_DIR, this.basename);
		this.docsPath = path.join(this.path, 'docs');
		this.changelogPath = path.join(this.path, 'CHANGELOG.md');
		this.readmePath = path.join(this.path, 'README.md');
		this.jsonPath = path.join(this.path, 'package.json');
		this.json = null;
		this.git = new Git();
	}

	get tag() {
		return `${this.name}@${this.version}`;
	}

	async exists() {
		return fs.pathExists(this.path);
	}

	async loadJSON() {
		this.json = await this.getJSON();
		this.description = this.json.description;
		this.version = this.json.version;
	}

	async getJSON() {
		return fs.readJson(this.jsonPath);
	}

	async getUnpublishedChanges() {
		const { name, basename } = this;
		let version;

		try {
			({ stdout: version } = await execa('npm', ['view', name]));
		} catch (_) {
			version = '0.0.0';
		}

		const range = `${name}@${version}..HEAD`;
		const query = `--grep=\\[${basename}\\]`;
		const fmt = '--pretty=format:%B';
		const prefix = `[${basename}]`;

		const { stdout: history } = await this.git.log([range, query, fmt]);

		return history
			.split('\n')
			.filter((x) => !!x)
			.map((x) => x.replace(prefix, '').trim());
	}

	async readChangelog() {
		return fs.readFile(this.changelogPath, 'utf8');
	}

	async writeChangelog(content) {
		return fs.writeFile(this.changelogPath, content);
	}

	async addChangelogEntry(changes = []) {
		if (!changes.length) {
			return;
		}

		const content = await this.readChangelog();
		const ptn = createSubstitutionPtn(CHGLOG_MARKER_START, CHGLOG_MARKER_END);
		const lines = [
			`${CHGLOG_MARKER_START}\n`,
			`${CHGLOG_MARKER_END}\n`,
			`## v${this.version}\n\n`,
		];

		for (const change of changes) {
			lines.push(`* ${change}\n`);
		}

		lines.push('\n');

		return this.writeChangelog(
			content.replace(ptn, lines.join(''))
		);
	}

	async readReadme() {
		return fs.readFile(this.readmePath, 'utf8');
	}

	async writeReadme(content) {
		return fs.writeFile(this.readmePath, content);
	}

	async updateReadmeDocsLink(ref) {
		if (!ref) {
			return;
		}

		const content = await this.readReadme();
		const ptn = createSubstitutionPtn(README_MARKER_START, README_MARKER_END);
		const link = [
			`${README_MARKER_START}`,
			`see [here](https://github.com/busticated/jsville/tree/${ref}/packages/periodical/docs)`,
			`${README_MARKER_END}`,
		];

		return this.writeReadme(
			content.replace(ptn, link.join('\n'))
		);
	}
}
