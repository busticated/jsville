# Class: Timer

Main `Timer` class.

**`Example`**

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

## Table of contents

### Constructors

- [constructor](Timer.md#constructor)

### Properties

- [ended](Timer.md#ended)
- [started](Timer.md#started)

### Methods

- [elapsed](Timer.md#elapsed)
- [end](Timer.md#end)
- [isFinished](Timer.md#isfinished)
- [isRunning](Timer.md#isrunning)
- [mark](Timer.md#mark)
- [now](Timer.md#now)
- [start](Timer.md#start)

## Constructors

### constructor

• **new Timer**(): [`Timer`](Timer.md)

#### Returns

[`Timer`](Timer.md)

#### Defined in

[index.ts:44](/packages/timer/src/index.ts#L44)

## Properties

### ended

• **ended**: `number`

end time, in milliseconds

#### Defined in

[index.ts:42](/packages/timer/src/index.ts#L42)

___

### started

• **started**: `number`

start time, in milliseconds

#### Defined in

[index.ts:37](/packages/timer/src/index.ts#L37)

## Methods

### elapsed

▸ **elapsed**(): `number`

Reports the number of milliseconds since starting the timer. Stops
incrementing when `timer.end()` is called.

#### Returns

`number`

**`Example`**

```ts
console.log('total ms elapsed:', timer.elapsed());
```

#### Defined in

[index.ts:113](/packages/timer/src/index.ts#L113)

___

### end

▸ **end**(`time?`): [`Timer`](Timer.md)

Ends the timer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `time?` | `number` | end time, in milliseconds (optional). |

#### Returns

[`Timer`](Timer.md)

**`Example`**

```ts
timer.end();
// or if you want to set a specific end time:
// timer.end(new Date(1995, 11, 18).getTime());
timer.isRunning(); // false
timer.isFinished(); // true
```

#### Defined in

[index.ts:81](/packages/timer/src/index.ts#L81)

___

### isFinished

▸ **isFinished**(): `boolean`

Reports whether or not the timer has been ended.

#### Returns

`boolean`

#### Defined in

[index.ts:142](/packages/timer/src/index.ts#L142)

___

### isRunning

▸ **isRunning**(): `boolean`

Reports whether or not the timer is currently running.

#### Returns

`boolean`

#### Defined in

[index.ts:135](/packages/timer/src/index.ts#L135)

___

### mark

▸ **mark**(`time?`): [`Timer`](Timer.md)

Marks a point in time

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `time?` | `number` | time to record, in milliseconds (optional). |

#### Returns

[`Timer`](Timer.md)

**`Example`**

```ts
timer.mark();
// or if you want to set a specific time:
// timer.mark(new Date(1995, 11, 19).getTime());
timer.isRunning(); // false
timer.isFinished(); // true
timer.started === timer.ended; // true
```

#### Defined in

[index.ts:100](/packages/timer/src/index.ts#L100)

___

### now

▸ **now**(): `number`

The number of milliseconds elapsed since the epoch. Simple proxy for `Date.now()`.

#### Returns

`number`

#### Defined in

[index.ts:128](/packages/timer/src/index.ts#L128)

___

### start

▸ **start**(`time?`): [`Timer`](Timer.md)

Starts the timer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `time?` | `number` | start time, in milliseconds (optional). |

#### Returns

[`Timer`](Timer.md)

**`Example`**

```ts
timer.start();
// or if you want to set a specific start time:
// timer.start(new Date(1995, 11, 17).getTime());
timer.isRunning(); // true
timer.isFinished(); // false
```

#### Defined in

[index.ts:63](/packages/timer/src/index.ts#L63)
