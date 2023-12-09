export type Callback = () => void;

export const noop = () => {};

export class Periodical {
	interval: number;
	fn: Callback;
	timeoutId: ReturnType<typeof setTimeout> | undefined;

	constructor(interval: number) {
		this.interval = interval;
		this.fn = noop;
		this.timeoutId = undefined;
	}

	start(fn: Callback, ctx?: object) {
		this.fn = fn.bind(ctx);
		this.timeoutId = setTimeout(this.exec.bind(this), this.msUntilNextRun());
	}

	stop() {
		clearTimeout(this.timeoutId);
		this.timeoutId = undefined;
	}

	isRunning() {
		return !!this.timeoutId;
	}

	exec() {
		if (!this.timeoutId){
			return;
		}

		this.timeoutId = setTimeout(this.exec.bind(this), this.msUntilNextRun());
		this.fn(); // TODO (busticated): catch error, stop, and rethrow
	}

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

