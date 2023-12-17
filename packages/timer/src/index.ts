/**
 * A li'l timer object whose only purpose is to track and report on the
 * unrelenting march of time.
 *
 * @packageDocumentation
 */

type SettableTimerFields = 'started' | 'ended';

/**
 * Main `Timer` class.
 *
 * @example
 * ```ts
 * import { Timer } from '@bust/timer';
 *
 * const timer = new Timer();
 *
 * timer.start();
 * timer.isRunning(); // true
 * timer.isFinished(); // false
 * setTimeout(
 * 	() => {
 * 		timer.end();
 * 		timer.isRunning(); // false
 * 		timer.isFinished(); // true
 * 		console.log('total ms elapsed:', timer.elapsed());
 * 	},
 * 	3000
 * );
 * ```
 */
export class Timer {
	/**
	 * start time, in milliseconds
	 */
	started: number;

	/**
	 * end time, in milliseconds
	 */
	ended: number;

	constructor() {
		this.started = 0;
		this.ended = 0;
	}

	/**
	 * Starts the timer
	 *
	 * @param time - start time, in milliseconds (optional).
	 *
	 * @example
	 * ```ts
	 * timer.start();
	 * // or if you want to set a specific start time:
	 * // timer.start(new Date(1995, 11, 17).getTime());
	 * timer.isRunning(); // true
	 * timer.isFinished(); // false
	 * ```
	 */
	start(time?: number) {
		return assignTime(this, 'started', time);
	}

	/**
	 * Ends the timer
	 *
	 * @param time - end time, in milliseconds (optional).
	 *
	 * @example
	 * ```ts
	 * timer.end();
	 * // or if you want to set a specific end time:
	 * // timer.end(new Date(1995, 11, 18).getTime());
	 * timer.isRunning(); // false
	 * timer.isFinished(); // true
	 * ```
	 */
	end(time?: number) {
		return assignTime(this, 'ended', time);
	}

	/**
	 * Marks a point in time
	 *
	 * @param time - time to record, in milliseconds (optional).
	 *
	 * @example
	 * ```ts
	 * timer.mark();
	 * // or if you want to set a specific time:
	 * // timer.mark(new Date(1995, 11, 19).getTime());
	 * timer.isRunning(); // false
	 * timer.isFinished(); // true
	 * timer.started === timer.ended; // true
	 * ```
	 */
	mark(time?: number) {
		return this.start(time).end(time);
	}

	/**
	 * Reports the number of milliseconds since starting the timer. Stops
	 * incrementing when `timer.end()` is called.
	 *
	 * @example
	 * ```ts
	 * console.log('total ms elapsed:', timer.elapsed());
	 * ```
	 */
	elapsed() {
		if (this.isFinished()){
			return this.ended - this.started;
		}

		if (this.isRunning()){
			return this.now() - this.started;
		}

		return 0;
	}

	/**
	 * The number of milliseconds elapsed since the epoch. Simple proxy for `Date.now()`.
	 */
	now() {
		return Date.now();
	}

	/**
	 * Reports whether or not the timer is currently running.
	 */
	isRunning() {
		return this.started > 0 && this.ended === 0;
	}

	/**
	 * Reports whether or not the timer has been ended.
	 */
	isFinished() {
		return this.started > 0 && this.ended > 0;
	}
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
function assignTime(ctx: Timer, field: SettableTimerFields, time: any) {
	if (typeof time === 'number' && time > 0) {
		ctx[field] = time;
	} else {
		ctx[field] = ctx.now();
	}

	return ctx;
}

