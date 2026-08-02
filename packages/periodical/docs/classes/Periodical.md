[**@bust/periodical**](../README.md)

***

# Class: Periodical

Defined in: [index.ts:51](/packages/periodical/src/index.ts#L51)

Main `Periodical` class.

## Example

```ts
import { Periodical } from '@bust/periodical';

const myFn = () => console.log('ran at:', new Date());
const interval = 10 * 1000; // run every 10s
const p = new Periodical(interval);

p.start(myFn);
p.isRunning(); // true

// ...time passes ⏳

p.stop();
p.isRunning(); // false
```

## Constructors

### Constructor

> **new Periodical**(`interval`): `Periodical`

Defined in: [index.ts:70](/packages/periodical/src/index.ts#L70)

#### Parameters

##### interval

`number`

how often you'd like to run your callback, in milliseconds.

#### Returns

`Periodical`

## Properties

### fn

> **fn**: [`Callback`](../type-aliases/Callback.md)

Defined in: [index.ts:60](/packages/periodical/src/index.ts#L60)

your callback function, optionally bound to the context you provide when calling `.start()`.

***

### interval

> **interval**: `number`

Defined in: [index.ts:55](/packages/periodical/src/index.ts#L55)

the interval in milliseconds.

***

### timeoutId

> **timeoutId**: `Timeout` \| `undefined`

Defined in: [index.ts:65](/packages/periodical/src/index.ts#L65)

the id for the last `setTimeout()` call.

## Methods

### exec()

> **exec**(): `void`

Defined in: [index.ts:127](/packages/periodical/src/index.ts#L127)

**`Internal`**

Executes your callback and enqueues the next run / execution

#### Returns

`void`

***

### isRunning()

> **isRunning**(): `boolean`

Defined in: [index.ts:119](/packages/periodical/src/index.ts#L119)

Reports whether or not your periodical is running

#### Returns

`boolean`

***

### msUntilNextRun()

> **msUntilNextRun**(`now?`): `number`

Defined in: [index.ts:140](/packages/periodical/src/index.ts#L140)

**`Internal`**

Calculates the number of milliseconds until next run / execution

#### Parameters

##### now?

`Date`

#### Returns

`number`

***

### start()

> **start**(`fn`, `ctx?`): `void`

Defined in: [index.ts:97](/packages/periodical/src/index.ts#L97)

Starts your periodical running

#### Parameters

##### fn

[`Callback`](../type-aliases/Callback.md)

the function you'd like executed

##### ctx?

`object`

the context in which you'd like your function executed (optional)

#### Returns

`void`

#### Example

```ts
const myObj = {
	value: 0,
	run() {
		this.value += 1;
		console.log('value:', this.value);
	}
};

p.start(myObj.run, myObj);
// or: `p.start(() => myObj.run());`
p.isRunning(); // 'true'
```

***

### stop()

> **stop**(): `void`

Defined in: [index.ts:111](/packages/periodical/src/index.ts#L111)

Stops your periodical

#### Returns

`void`

#### Example

```ts
p.stop();
p.isRunning(); // 'false'
```
