[**@bust/periodical**](../README.md)

***

# Class: Periodical

Defined in: [index.ts:50](/packages/periodical/src/index.ts#L50)

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

Defined in: [index.ts:69](/packages/periodical/src/index.ts#L69)

#### Parameters

##### interval

`number`

how often you'd like to run your callback, in milliseconds.

#### Returns

`Periodical`

## Properties

### fn

> **fn**: [`Callback`](../type-aliases/Callback.md)

Defined in: [index.ts:59](/packages/periodical/src/index.ts#L59)

your callback function, optionally bound to the context you provide when calling `.start()`.

***

### interval

> **interval**: `number`

Defined in: [index.ts:54](/packages/periodical/src/index.ts#L54)

the interval in milliseconds.

***

### timeoutId

> **timeoutId**: `Timeout` \| `undefined`

Defined in: [index.ts:64](/packages/periodical/src/index.ts#L64)

the id for the last `setTimeout()` call.

## Methods

### exec()

> **exec**(): `void`

Defined in: [index.ts:126](/packages/periodical/src/index.ts#L126)

**`Internal`**

Executes your callback and enqueues the next run / execution

#### Returns

`void`

***

### isRunning()

> **isRunning**(): `boolean`

Defined in: [index.ts:118](/packages/periodical/src/index.ts#L118)

Reports whether or not your periodical is running

#### Returns

`boolean`

***

### msUntilNextRun()

> **msUntilNextRun**(`now?`): `number`

Defined in: [index.ts:139](/packages/periodical/src/index.ts#L139)

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

Defined in: [index.ts:96](/packages/periodical/src/index.ts#L96)

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

Defined in: [index.ts:110](/packages/periodical/src/index.ts#L110)

Stops your periodical

#### Returns

`void`

#### Example

```ts
p.stop();
p.isRunning(); // 'false'
```
