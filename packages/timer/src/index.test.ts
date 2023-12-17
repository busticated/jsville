import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { Timer } from './index.js';

const STARTED = 1702006671868;
const ENDED = 1702006671900;
const DELTA = 5; // b/c js timers (O_o)


describe('@bust/timer', () => {
	it('Initializes', () => {
		const timer = new Timer();

		assert(timer.hasOwnProperty('started'));
		assert(timer.hasOwnProperty('ended'));
		assert.equal(typeof timer.isRunning, 'function');
		assert.equal(timer.isRunning(), false);
		assert.equal(typeof timer.isFinished, 'function');
		assert.equal(timer.isFinished(), false);
		assert.equal(typeof timer.elapsed, 'function');
		assert.equal(timer.elapsed(), 0);
		assert.equal(typeof timer.now, 'function');
		assert(timer.now() > STARTED);
		assert.equal(typeof timer.start, 'function');
		assert.equal(timer.start(), timer);
		assert.equal(typeof timer.end, 'function');
		assert.equal(timer.end(), timer);
		assert.equal(typeof timer.mark, 'function');
		assert.equal(timer.mark(), timer);
	});

	it('Captures start time', () => {
		const timer = new Timer();

		timer.start();

		assert(timer.started);
		assert(timer.now() - timer.started < DELTA);
		assert.equal(timer.ended, 0);
		assert.equal(timer.isRunning(), true);
		assert.equal(timer.isFinished(), false);
	});

	it('Accepts a start time if provided', () => {
		const timer = new Timer();

		timer.start(STARTED);

		assert(timer.started);
		assert.equal(timer.started, STARTED);
		assert.equal(timer.ended, 0);
		assert.equal(timer.isRunning(), true);
		assert.equal(timer.isFinished(), false);
	});

	it('Captures end time', (ctx, done) => {
		const timer = new Timer();
		const delay = 50;
		const runAssertions = () => {
			timer.end();
			assert(timer.started > 0);
			assert(timer.ended > 0);
			assert(timer.now() - timer.ended < delay + DELTA);
			assert.equal(timer.isRunning(), false);
			assert.equal(timer.isFinished(), true);
			done();
		};

		timer.start();
		setTimeout(runAssertions, delay);
	});

	it('Accepts an end time if provided', () => {
		const timer = new Timer();

		timer.start(STARTED);
		timer.end(ENDED);

		assert.equal(timer.started, STARTED);
		assert.equal(timer.ended, ENDED);
		assert.equal(timer.isRunning(), false);
		assert.equal(timer.isFinished(), true);
	});

	it('Marks start & end time', () => {
		const timer = new Timer();
		const now = timer.now();

		timer.mark();

		assert(timer.started > 0);
		assert(now - timer.started < DELTA);
		assert(timer.ended > 0);
		assert(now - timer.ended < DELTA);
		assert.equal(timer.isRunning(), false);
		assert.equal(timer.isFinished(), true);
	});

	it('Accepts a mark time if provided', () => {
		const timer = new Timer();

		timer.mark(ENDED);

		assert.equal(timer.started, ENDED);
		assert.equal(timer.ended, ENDED);
		assert.equal(timer.isRunning(), false);
		assert.equal(timer.isFinished(), true);
	});

	it('Calculates elapsed time', () => {
		const timer = new Timer();

		timer.start(STARTED);
		timer.end(ENDED);

		assert.equal(timer.elapsed(), 32);
	});

	it('Calculates elapsed time when timer is still running', (ctx, done) => {
		const timer = new Timer();
		const delay = 50;
		const runAssertions = () => {
			assert(timer.elapsed() < delay + DELTA);
			assert.equal(timer.ended, 0);
			assert.equal(timer.isRunning(), true);
			assert.equal(timer.isFinished(), false);
			done();
		};

		timer.start();
		setTimeout(runAssertions, delay);
	});

	it('Determines if the timer is running', () => {
		const timer = new Timer();

		assert.equal(timer.isRunning(), false);

		timer.start();

		assert.equal(timer.isRunning(), true);

		timer.end();

		assert.equal(timer.isRunning(), false);
	});

	it('Determine if the timer is finished', () => {
		const timer = new Timer();

		assert.equal(timer.isFinished(), false);

		timer.start();

		assert.equal(timer.isFinished(), false);

		timer.end();

		assert.equal(timer.isFinished(), true);
	});

	it('Should not error if called derpily', () => {
		const timer = new Timer();
		const input = [undefined, null, '', false, 0];

		assert.doesNotThrow(() => {
			// @ts-expect-error - testing error cases
			input.forEach((x) => timer.start(x).end(x));
		});
	});
});

