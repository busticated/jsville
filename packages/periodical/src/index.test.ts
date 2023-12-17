import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { Periodical, noop } from './index.js';


describe('@bust/periodically', () => {
	const interval = 10 * 1000;

	it('initializes', () => {
		const p = new Periodical(interval);
		assert.equal(p.interval, interval);
		assert.equal(p.fn, noop);
		assert.equal(p.timeoutId, undefined);
		assert.equal(p.isRunning(), false);
		assert.equal(typeof p.start, 'function');
		assert.equal(typeof p.stop, 'function');
		assert.equal(typeof p.exec, 'function');
		assert.equal(noop(), undefined); // lol coverage (-__-)
	});

	it('starts with object method as callback', (ctx) => {
		const p = new Periodical(interval);
		const myObj = {
			value: 0,
			run() {
				this.value += 1;
			}
		};

		ctx.mock.timers.enable(['setTimeout']);

		p.start(myObj.run, myObj);

		ctx.mock.timers.tick(interval);

		assert.equal(myObj.value, 1);
		assert.equal(typeof p.timeoutId, 'number');
		assert.equal(p.isRunning(), true);
	});

	it('starts with function as callback', (ctx) => {
		const p = new Periodical(interval);
		const run = ctx.mock.fn();

		ctx.mock.timers.enable(['setTimeout']);

		p.start(run);

		ctx.mock.timers.tick(interval);

		assert.equal(run.mock.callCount(), 1);
		assert.equal(typeof p.timeoutId, 'number');
		assert.equal(p.isRunning(), true);
	});

	it('stops', (ctx) => {
		const p = new Periodical(interval);
		const myObj = { run: ctx.mock.fn() };

		ctx.mock.timers.enable(['setTimeout']);

		p.start(myObj.run, myObj);
		p.stop();

		assert.equal(myObj.run.mock.callCount(), 0);
		assert.equal(p.timeoutId, undefined);
		assert.equal(p.isRunning(), false);
	});

	it('executes', (ctx) => {
		const p = new Periodical(interval);
		const run = ctx.mock.fn();

		ctx.mock.timers.enable(['setTimeout']);

		p.start(run);
		p.exec();

		assert.equal(run.mock.callCount(), 1);
		assert.notEqual(p.fn, noop);
		assert.equal(typeof p.timeoutId, 'number');
		assert.equal(p.isRunning(), true);
	});

	it('does not execute when stopped', (ctx) => {
		const p = new Periodical(interval);
		const myObj = { run: ctx.mock.fn() };

		p.exec();

		assert.equal(myObj.run.mock.callCount(), 0);
		assert.equal(p.fn, noop);
		assert.equal(p.timeoutId, undefined);
		assert.equal(p.isRunning(), false);
	});

	it('executes periodically', (ctx) => {
		const p = new Periodical(interval);
		const myObj = { run: ctx.mock.fn() };

		ctx.mock.timers.enable(['setTimeout']);

		p.start(myObj.run, myObj);

		ctx.mock.timers.tick(interval);

		assert.equal(myObj.run.mock.callCount(), 1);

		ctx.mock.timers.tick(interval);

		assert.equal(myObj.run.mock.callCount(), 2);

		ctx.mock.timers.tick(interval);

		assert.equal(myObj.run.mock.callCount(), 3);
	});

	it('calculates milliseconds until next run', () => {
		const p = new Periodical(interval);
		assert.equal(typeof p.msUntilNextRun(), 'number');
		assert(p.msUntilNextRun() > 0);
	});

	it('calculates milliseconds until next run from given date', () => {
		let date = new Date('1983-04-01T00:00:05.000Z'); // steven m. newman takes a stroll
		let interval = 10 * 1000; // every 10s on the dot
		let p = new Periodical(interval);

		assert.equal(p.msUntilNextRun(date), 5000);
		assert.equal(getTimeStampForNextRun(date, p), 'Fri, 01 Apr 1983 00:00:10 GMT');

		date = new Date('1983-04-01T00:00:07.000Z');
		p = new Periodical(interval);

		assert.equal(p.msUntilNextRun(date), 3000);
		assert.equal(getTimeStampForNextRun(date, p), 'Fri, 01 Apr 1983 00:00:10 GMT');

		interval = 60 * 1000; // every 1m on the dot
		date = new Date('1983-04-01T00:00:37.000Z');
		p = new Periodical(interval);

		assert.equal(p.msUntilNextRun(date), 23000);
		assert.equal(getTimeStampForNextRun(date, p), 'Fri, 01 Apr 1983 00:01:00 GMT');

		date = new Date('1983-04-01T00:00:45.000Z');
		p = new Periodical(interval);

		assert.equal(p.msUntilNextRun(date), 15000);
		assert.equal(getTimeStampForNextRun(date, p), 'Fri, 01 Apr 1983 00:01:00 GMT');
	});

	it('calculates milliseconds until next run when datetime is exactly "on the dot"', () => {
		const date = new Date('1983-04-01T00:00:00.000Z');
		const interval = 60 * 1000; // every 1m on the dot
		const p = new Periodical(interval);

		assert.equal(p.msUntilNextRun(date), 60000);
		assert.equal(getTimeStampForNextRun(date, p), 'Fri, 01 Apr 1983 00:01:00 GMT');
	});

	function getTimeStampForNextRun(d: Date, p: Periodical) {
		return new Date(d.getTime() + p.msUntilNextRun(d)).toUTCString();
	}
});

