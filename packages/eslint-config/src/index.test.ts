import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import * as eslintConfig from './index.js';


describe('@bust/eslint-config', () => {
	it('has tests', () => {
		assert(eslintConfig);
		assert.equal(eslintConfig.greet(), 'hello world!');
	});
});

