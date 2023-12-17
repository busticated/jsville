import { describe, it } from 'node:test';
import assert from 'node:assert';
import * as base52 from './index.js';


describe('@bust/numeric-id-hasher', () => {
	getSpecs().forEach(({ id, hash }) => {
		it(`encodes '${id}' to '${hash}'`, () => {
			assert.strictEqual(base52.encode(id), hash);
		});
	});

	getSpecs().forEach(({ id, hash }) => {
		it(`decodes '${hash}' to '${id}'`, () => {
			assert.strictEqual(base52.decode(hash), id);
		});
	});

	it('removes padding from zero-padded ids', () => {
		const hash = base52.encode('0000001');

		assert.strictEqual(hash, '3');

		const id = base52.decode(hash);

		assert.strictEqual(id, '1');
	});

	it('handles bad input', () => {
		let error;

		try {
			base52.encode('666LOLWUT');
		} catch (e) {
			error = e as Error;
		}

		assert(error instanceof Error);
		assert.strictEqual(error.message, 'only ids with digits 0-9 can be encoded');
	});

	function getSpecs(){
		return [
			{ id: '1', hash: '3' },
			{ id: '22', hash: 'R' },
			{ id: '333', hash: '8B' },
			{ id: '4444', hash: '3XJ' },
			{ id: '55555', hash: 'M4p' },
			{ id: '676767676767676767', hash: '5DLHvp97zSB' },
			{ id: '898989898989898989', hash: '6GFqXGaDBhr' },
			{ id: '10000000000000000000000000', hash: '7aDn7BhWK5E4NvC' }
		];
	}
});

