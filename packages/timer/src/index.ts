type SettableTimerFields = 'started' | 'ended';

export class Timer {
	started: number;
	ended: number;

	constructor() {
		this.started = 0;
		this.ended = 0;
	}

	start(time?: number) {
		return assignTime(this, 'started', time);
	}

	end(time?: number) {
		return assignTime(this, 'ended', time);
	}

	mark(time?: number) {
		return this.start(time).end(time);
	}

	elapsed() {
		if (this.isFinished()){
			return this.ended - this.started;
		}

		if (this.isRunning()){
			return this.now() - this.started;
		}

		return 0;
	}

	now() {
		return Date.now();
	}

	isRunning() {
		return this.started > 0 && this.ended === 0;
	}

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

