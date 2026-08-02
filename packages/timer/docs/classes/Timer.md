[**@bust/timer**](../README.md)

***

# Class: Timer

Defined in: [index.ts:33](/packages/timer/src/index.ts#L33)

Main `Timer` class.

## Example

```ts
import { Timer } from '@bust/timer';

const timer = new Timer();

timer.start();
timer.isRunning(); // true
timer.isFinished(); // false
setTimeout(
	() => {
		timer.end();
		timer.isRunning(); // false
		timer.isFinished(); // true
		console.log('total ms elapsed:', timer.elapsed());
	},
	3000
);
```

## Constructors

### Constructor

> **new Timer**(): `Timer`

Defined in: [index.ts:44](/packages/timer/src/index.ts#L44)

#### Returns

`Timer`

## Properties

### ended

> **ended**: `number`

Defined in: [index.ts:42](/packages/timer/src/index.ts#L42)

end time, in milliseconds

***

### started

> **started**: `number`

Defined in: [index.ts:37](/packages/timer/src/index.ts#L37)

start time, in milliseconds

## Methods

### elapsed()

> **elapsed**(): `number`

Defined in: [index.ts:113](/packages/timer/src/index.ts#L113)

Reports the number of milliseconds since starting the timer. Stops
incrementing when `timer.end()` is called.

#### Returns

`number`

#### Example

```ts
console.log('total ms elapsed:', timer.elapsed());
```

***

### end()

> **end**(`time?`): `Timer`

Defined in: [index.ts:81](/packages/timer/src/index.ts#L81)

Ends the timer

#### Parameters

##### time?

`number`

end time, in milliseconds (optional).

#### Returns

`Timer`

#### Example

```ts
timer.end();
// or if you want to set a specific end time:
// timer.end(new Date(1995, 11, 18).getTime());
timer.isRunning(); // false
timer.isFinished(); // true
```

***

### isFinished()

> **isFinished**(): `boolean`

Defined in: [index.ts:142](/packages/timer/src/index.ts#L142)

Reports whether or not the timer has been ended.

#### Returns

`boolean`

***

### isRunning()

> **isRunning**(): `boolean`

Defined in: [index.ts:135](/packages/timer/src/index.ts#L135)

Reports whether or not the timer is currently running.

#### Returns

`boolean`

***

### mark()

> **mark**(`time?`): `Timer`

Defined in: [index.ts:100](/packages/timer/src/index.ts#L100)

Marks a point in time

#### Parameters

##### time?

`number`

time to record, in milliseconds (optional).

#### Returns

`Timer`

#### Example

```ts
timer.mark();
// or if you want to set a specific time:
// timer.mark(new Date(1995, 11, 19).getTime());
timer.isRunning(); // false
timer.isFinished(); // true
timer.started === timer.ended; // true
```

***

### now()

> **now**(): `number`

Defined in: [index.ts:128](/packages/timer/src/index.ts#L128)

The number of milliseconds elapsed since the epoch. Simple proxy for `Date.now()`.

#### Returns

`number`

***

### start()

> **start**(`time?`): `Timer`

Defined in: [index.ts:63](/packages/timer/src/index.ts#L63)

Starts the timer

#### Parameters

##### time?

`number`

start time, in milliseconds (optional).

#### Returns

`Timer`

#### Example

```ts
timer.start();
// or if you want to set a specific start time:
// timer.start(new Date(1995, 11, 17).getTime());
timer.isRunning(); // true
timer.isFinished(); // false
```
