/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck -- these tests deliberately feed malformed/mistyped schema & env
// values to exercise runtime validation, which fights static typing by design.
import { describe, it, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { Config, ConfigEnvVars } from './config.js';


describe('@bust/config', () => {
	let config!: Config;
	let schema!: object;

	beforeEach(() => {
		schema = {
			one: { default: 'one', env: 'TEST_ONE', public: true },
			two: { default: 'two', format: ['two', '2', 'II'], env: 'TEST_TWO' },
			three: { default: 'http://example.com', format: 'url', env: 'TEST_THREE' },
			four: {
				a: { default: 'a' },
				b: {
					default: 4,
					format: 'int',
					env: 'TEST_FOUR',
					public: true,
				},
				c: { default: 'c' },
			},
			five: { a: { b: { default: 'ok' }, c: { default: 'ok' } } },
			six: { default: /foo/, public: true },
			seven: { default: { ok: true } },
			eight: { default: 1 },
			nine: { default: true },
			ten: {
				default: ['a', 'b'],
				format: 'array',
				env: 'TEST_TEN',
				public: true,
			},
		};
		config = new Config({ schema });
	});

	describe('Getting configuration settings', () => {
		it('Gets a setting', () => {
			const value = config.get('five.a.b');
			assert.strictEqual(value, 'ok');
		});

		it('Throws when setting isn\'t available', () => {
			assert.throws(
				() => config.get('NOPE!'),
				{
					'message': '\'NOPE!\' is not available - please ensure you\'ve set it'
				},
			);
		});
	});

	describe('Getting `public` configuration settings', () => {
		it('Gets all publicly available settings', () => {
			const settings = config.getPublicSettings();
			assert.deepEqual(settings, {
				'one': {
					default: 'one',
					value: 'one',
					format: 'string',
					env: 'TEST_ONE',
					public: true,
				},
				'four.b': {
					default: 4,
					value: 4,
					format: 'int',
					env: 'TEST_FOUR',
					public: true,
				},
				'six': {
					default: /foo/,
					value: /foo/,
					format: 'regexp',
					public: true,
				},
				'ten': {
					default: ['a', 'b'],
					value: ['a', 'b'],
					format: 'array',
					env: 'TEST_TEN',
					public: true,
				},
			});
		});
	});

	describe('Getting `public` environment variables', () => {
		it('Gets all publicly available environment variables', () => {
			const env = config.getPublicEnvVars();
			assert.deepEqual(env, {
				'TEST_FOUR': 4,
				'TEST_ONE': 'one',
				'TEST_TEN': [
					'a',
					'b',
				],
			});
		});
	});

	describe('Hydrating schema', () => {
		let fakeEnv!: ConfigEnvVars;

		beforeEach(() => {
			fakeEnv = {
				TEST_ONE: 'one-updated',
				TEST_TWO: '2',
				TEST_THREE: 'http://example.com/updated',
			};
		});

		it('Establishes settings', () => {
			const settings = config.hydrate(schema);
			const keys = [...settings.keys()];

			assert.deepEqual(keys, [
				'one',
				'two',
				'three',
				'four.a',
				'four.b',
				'four.c',
				'five.a.b',
				'five.a.c',
				'six',
				'seven',
				'eight',
				'nine',
				'ten',
			]);
			assert.deepEqual(settings.get('two'), {
				default: 'two',
				value: 'two',
				format: ['two', '2', 'II'],
				env: 'TEST_TWO',
			});
			assert.deepEqual(settings.get('five.a.b'), {
				default: 'ok',
				value: 'ok',
				format: 'string',
			});
			assert.deepEqual(settings.get('ten'), {
				default: ['a', 'b'],
				value: ['a', 'b'],
				format: 'array',
				env: 'TEST_TEN',
				public: true,
			});
		});

		it('Establishes settings when environment variables are provided', () => {
			const settings = config.hydrate(schema, fakeEnv);
			const keys = [...settings.keys()];

			assert.deepEqual(keys, [
				'one',
				'two',
				'three',
				'four.a',
				'four.b',
				'four.c',
				'five.a.b',
				'five.a.c',
				'six',
				'seven',
				'eight',
				'nine',
				'ten',
			]);
			assert.deepEqual(settings.get('one'), {
				default: 'one',
				value: 'one-updated',
				format: 'string',
				env: 'TEST_ONE',
				public: true,
			});
		});

		it('Throws when schema uses unknown format', () => {
			const schema = {
				test: { default: false, format: 'NOPE!', env: 'TEST' },
			};

			assert.throws(
				() => config.hydrate(schema),
				{
					message: '\'test\' uses an unrecognized format: NOPE!'
				}
			);
		});

		it('Throws when schema has null / undefined values', () => {
			const schema = {
				test: { default: null, format: 'string', env: 'TEST' },
			};

			assert.throws(
				() => config.hydrate(schema),
				{
					message: '\'test\' is missing - please set it!',
				}
			);
		});

		it('Throws when `enum` value is invalid', () => {
			const env = { TEST: 'NOPE!' };
			const schema = {
				test: { default: 'NOPE!', format: ['a', 'b', 'c'], env: 'TEST' },
			};

			assert.throws(
				() => config.hydrate(schema),
				{
					message: '\'test\': must be one of a|b|c',
				}
			);

			schema.test.default = 'a';

			assert.throws(
				() => config.hydrate(schema, env),
				{
					message: '\'test\': must be one of a|b|c',
				}
			);

			schema.test.default = 'a';
			env.TEST = 'b';

			assert.doesNotThrow(
				() => config.hydrate(schema, env),
			);
		});

		it('Throws when `int` value is invalid', () => {
			const env = { TEST: 'NOPE!' };
			const schema = {
				test: { default: 'NOPE!', format: 'int', env: 'TEST' },
			};

			assert.throws(
				() => config.hydrate(schema),
				{
					message: '\'test\': must be an integer',
				}
			);

			schema.test.default = 1.1;

			assert.throws(
				() => config.hydrate(schema),
				{
					message: '\'test\': must be an integer',
				}
			);

			schema.test.default = 1;

			assert.throws(
				() => config.hydrate(schema, env),
				{
					message: '\'test\': must be an integer',
				}
			);

			schema.test.default = 1;
			env.TEST = 2;

			assert.doesNotThrow(
				() => config.hydrate(schema, env),
			);
		});

		it('Throws when `nat` value is invalid', () => {
			const env = { TEST: 'NOPE!' };
			const schema = {
				test: { default: 'NOPE!', format: 'nat', env: 'TEST' },
			};

			assert.throws(
				() => config.hydrate(schema),
				{
					message: '\'test\': must be a positive integer',
				}
			);

			schema.test.default = -1;

			assert.throws(
				() => config.hydrate(schema),
				{
					message: '\'test\': must be a positive integer',
				}
			);

			schema.test.default = 1.0;

			assert.throws(
				() => config.hydrate(schema, env),
				{
					message: '\'test\': must be a positive integer',
				}
			);

			schema.test.default = 1.0;
			env.TEST = 2.5;

			assert.doesNotThrow(
				() => config.hydrate(schema, env),
			);
		});

		it('Throws when `number` value is invalid', () => {
			const env = { TEST: 'NOPE!' };
			const schema = {
				test: { default: 'NOPE!', format: 'number', env: 'TEST' },
			};

			assert.throws(
				() => config.hydrate(schema),
				{
					message: '\'test\': must be a number',
				}
			);

			schema.test.default = -1.5;

			assert.throws(
				() => config.hydrate(schema, env),
				{
					message: '\'test\': must be a number',
				}
			);

			schema.test.default = -1.5;
			env.TEST = -2.5;

			assert.doesNotThrow(
				() => config.hydrate(schema, env),
			);
		});

		it('Throws when `url` value is invalid', () => {
			const env = { TEST: 'NOPE!' };
			const schema = {
				test: { default: 'NOPE!', format: 'url', env: 'TEST' },
			};

			assert.throws(
				() => config.hydrate(schema),
				{
					message: '\'test\': must be a valid url',
				}
			);

			schema.test.default = 'http://example.com';

			assert.throws(
				() => config.hydrate(schema, env),
				{
					message: '\'test\': must be a valid url',
				}
			);

			schema.test.default = 'http://example.com';
			env.TEST = 'http://example.com/updated';

			assert.doesNotThrow(
				() => config.hydrate(schema, env),
			);
		});

		it('Throws when `boolean` value is invalid', () => {
			const env = { TEST: 'NOPE!' }; // valid b/c of coercion
			const schema = {
				test: { default: 'NOPE!', format: 'boolean', env: 'TEST' },
			};

			assert.throws(
				() => config.hydrate(schema),
				{
					message: '\'test\': must be a boolean',
				}
			);

			schema.test.default = false;

			assert.doesNotThrow(
				() => config.hydrate(schema, env),
			);
		});

		it('Throws when `string` value is invalid', () => {
			const env = { TEST: 'NOPE!' };
			const schema = {
				test: { default: false, format: 'string', env: 'TEST' },
			};

			assert.throws(
				() => config.hydrate(schema),
				{
					message: '\'test\': must be a string',
				}
			);

			schema.test.default = 'ok';

			assert.doesNotThrow(
				() => config.hydrate(schema, env),
			);
		});

		it('Throws when `regexp` value is invalid', () => {
			const env = { TEST: 'NOPE!' };
			const schema = {
				test: { default: false, format: 'regexp', env: 'TEST' },
			};

			assert.throws(
				() => config.hydrate(schema),
				{
					message: '\'test\': must be a regular expression (RegExp)',
				}
			);

			schema.test.default = /ok/;

			assert.doesNotThrow(
				() => config.hydrate(schema, env),
			);
		});

		it('Throws when `object` value is invalid', () => {
			const env = { TEST: 'NOPE!' };
			const schema = {
				test: { default: false, format: 'object', env: 'TEST' },
			};

			assert.throws(
				() => config.hydrate(schema),
				{
					message: '\'test\': must be an object',
				}
			);

			schema.test.default = {};

			assert.throws(
				() => config.hydrate(schema, env),
				{
					message: '\'test\': must be an object',
				}
			);

			schema.test.default = {};
			env.TEST = '{}';

			assert.doesNotThrow(
				() => config.hydrate(schema, env),
			);
		});

		it('Throws when `array` value is invalid', () => {
			const schema = {
				test: { default: false, format: 'array', env: 'TEST' },
			};

			assert.throws(
				() => config.hydrate(schema),
				{
					message: '\'test\': must be an array',
				}
			);

			schema.test.default = 'one,two,three';

			assert.throws(
				() => config.hydrate(schema),
				{
					message: '\'test\': must be an array',
				}
			);

			const env = { TEST: false };
			schema.test.default = [];

			assert.throws(
				() => config.hydrate(schema, env),
				{
					message: '\'test\': must be an array',
				}
			);

			schema.test.default = [];
			env.TEST = 'one,two,three';

			assert.doesNotThrow(
				() => config.hydrate(schema, env),
			);

			schema.test.default = [];
			env.TEST = ['one', 'two', 'three'];

			assert.doesNotThrow(
				() => config.hydrate(schema, env),
			);
		});
	});
});
