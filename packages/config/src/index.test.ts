import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import * as config from './index.js';


describe('@bust/config', () => {
	it('has tests', () => {
		assert(config);
		assert.equal(config.greet(), 'hello world!');
	});
});

