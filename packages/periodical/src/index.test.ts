import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import * as periodical from './index.js';


describe('@bust/periodical', () => {
	it('has tests', () => {
		assert(periodical);
		assert.equal(periodical.greet(), 'hello world!');
	});
});

