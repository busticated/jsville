/**
 * Runs a given function at a given interval normalized to clock time such that
 * each execution happens "on the dot" - e.g.
 *
 * ```
 * 10s interval: 12:00:10, 12:00:20, 12:00:30, etc
 * 30s interval: 12:00:30, 12:01:00, 12:01:30, etc
 *  1m interval: 12:01:00, 12:02:00, 12:03:00, etc
 * 30m interval: 12:30:00, 13:00:00, 13:30:00, etc
 *  1h interval: 13:00:00, 14:00:00, 15:00:00, etc
 * ```
 *
 * NOTE: Due to how `setTimeout()` works (see [docs](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#reasons_for_delays_longer_than_specified)),
 * you can expect some drift. In practice, it tends not to matter - delta tends
 * to be < 5ms - but if you need high-accuracy and ironclad reliability, definitely
 * reach for a different tool 🤗
 *
 * @packageDocumentation
 */

export type Callback = () => void;

/**
 * A no-op function used for testing
 * @hidden
 */
export const noop = () => {};



/**
 * Main `Periodical` class.
 *
 * @example
 * ```ts
 * import { Periodical } from '@bust/periodical';
 *
 * const myFn = () => console.log('ran at:', new Date());
 * const interval = 10 * 1000; // run every 10s
 * const p = new Periodical(interval);
 *
 * p.start(myFn);
 * p.isRunning(); // true
 *
 * // ...time passes ⏳
 *
 * p.stop();
 * p.isRunning(); // false
 * ```
 */
export class Periodical {
	/**
	 * the interval in milliseconds.
	 */
	interval: number;

	/**
	 * your callback function, optionally bound to the context you provide when calling `.start()`.
	 */
	fn: Callback;

	/**
	 * the id for the last `setTimeout()` call.
	 */
	timeoutId: ReturnType<typeof setTimeout> | undefined;

	/**
	 * @param interval - how often you'd like to run your callback, in milliseconds.
	 */
	constructor(interval: number) {
		this.interval = interval;
		this.fn = noop;
		this.timeoutId = undefined;
	}

	/**
	 * Starts your periodical running
	 *
	 * @param fn - the function you'd like executed
	 * @param ctx - the context in which you'd like your function executed (optional)
	 *
	 * @example
	 * ```ts
	 * const myObj = {
	 *	value: 0,
	 *	run() {
	 *		this.value += 1;
	 *		console.log('value:', this.value);
	 *	}
	 * };
	 *
	 * p.start(myObj.run, myObj);
	 * // or: `p.start(() => myObj.run());`
	 * p.isRunning(); // 'true'
	 * ```
	 */
	start(fn: Callback, ctx?: object) {
		this.fn = fn.bind(ctx);
		this.timeoutId = setTimeout(this.exec.bind(this), this.msUntilNextRun());
	}

	/**
	 * Stops your periodical
	 *
	 * @example
	 * ```ts
	 * p.stop();
	 * p.isRunning(); // 'false'
	 * ```
	 */
	stop() {
		clearTimeout(this.timeoutId);
		this.timeoutId = undefined;
	}

	/**
	 * Reports whether or not your periodical is running
	 */
	isRunning() {
		return !!this.timeoutId;
	}

	/**
	 * Executes your callback and enqueues the next run / execution
	 * @internal
	 */
	exec() {
		if (!this.timeoutId){
			return;
		}

		this.timeoutId = setTimeout(this.exec.bind(this), this.msUntilNextRun());
		this.fn(); // TODO (busticated): catch error, stop, and rethrow
	}

	/**
	 * Calculates the number of milliseconds until next run / execution
	 * @internal
	 */
	msUntilNextRun(now?: Date) {
		now = now || new Date();
		const original = new Date(now.getTime());
		now = new Date(Math.ceil(now.getTime() / this.interval) * this.interval);

		if (now.getTime() - original.getTime() <= 0){
			return this.interval;
		}

		return now.getTime() - original.getTime();
	}
}

