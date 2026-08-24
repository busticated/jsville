import { execa } from 'execa';


export class Git {
	constructor() {
		this.bin = 'git';
	}

	async exec(args, options) {
		return execa(this.bin, args, options);
	}

	async add(args, options) {
		return this.exec(['add', ...args], options);
	}

	async commit(msg, args = [], options) {
		return this.exec(['commit', '--message', msg, ...args], options);
	}

	async tag(args, options) {
		return this.exec(['tag', ...args], options);
	}

	async log(args, options) {
		return this.exec(['log', ...args], options);
	}

	async hasTag(tag, options) {
		try {
			await this.exec(['rev-parse', '--verify', '--quiet', `refs/tags/${tag}`], options);
			return true;
		} catch {
			return false;
		}
	}
}

