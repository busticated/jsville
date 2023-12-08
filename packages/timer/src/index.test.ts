import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import * as timer from './index.js';


describe('@bust/timer', () => {
	it('has tests', () => {
		assert(timer);
		assert.equal(timer.greet(), 'hello world!');
	});
});

