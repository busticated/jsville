import * as path from 'node:path';
import fs from 'fs-extra';
import _ from 'lodash';
import { TEMPLATES_DIR } from './constants.mjs';


export const loadTemplates = async () => {
	const files = await fs.readdir(TEMPLATES_DIR, { withFileTypes: true });
	const templates = {};

	for (const f of files){
		if (!f.isFile() || !f.name.toLowerCase().endsWith('.tmpl')){
			continue;
		}

		const filename = path.join(TEMPLATES_DIR, f.name);
		const tmplData = await fs.readFile(filename, 'utf8');
		const key = formatKey(f);

		templates[key] = _.template(tmplData, {
			imports: {
				camelCase: _.camelCase,
				upperFirst: _.upperFirst
			}
		});
	}

	return templates;
};


// UTILS //////////////////////////////////////////////////////////////////////
function formatKey(file){
	const parts = file.name.split('.').filter(ext => ext !== 'tmpl');
	const lastIndex = parts.length - 1;

	if (parts.length > 1){
		parts[lastIndex] = parts[lastIndex].toUpperCase();
	}

	const ext = parts.pop();
	return _.camelCase(parts.join('-')) + ext;
}

