import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import * as numericIdHasher from './index.js';


describe('@bust/numeric-id-hasher', () => {
	it('has tests', () => {
		assert(numericIdHasher);
		assert.equal(numericIdHasher.greet(), 'hello world!');
	});
});

