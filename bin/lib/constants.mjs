import * as url from 'node:url';
import * as path from 'node:path';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


export const REPO_DIR = path.join(__dirname, '..', '..');
export const TEMP_DIR =  path.join(REPO_DIR, 'tmp');
export const PACKAGES_DIR = path.join(REPO_DIR, 'packages');
export const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

