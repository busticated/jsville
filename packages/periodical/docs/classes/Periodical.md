# Class: Periodical

Main `Periodical` class.

**`Example`**

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

## Table of contents

### Constructors

- [constructor](Periodical.md#constructor)

### Properties

- [fn](Periodical.md#fn)
- [interval](Periodical.md#interval)
- [timeoutId](Periodical.md#timeoutid)

### Methods

- [exec](Periodical.md#exec)
- [isRunning](Periodical.md#isrunning)
- [msUntilNextRun](Periodical.md#msuntilnextrun)
- [start](Periodical.md#start)
- [stop](Periodical.md#stop)

## Constructors

### constructor

• **new Periodical**(`interval`): [`Periodical`](Periodical.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `interval` | `number` | how often you'd like to run your callback, in milliseconds. |

#### Returns

[`Periodical`](Periodical.md)

#### Defined in

[index.ts:70](/packages/periodical/src/index.ts#L70)

## Properties

### fn

• **fn**: [`Callback`](../README.md#callback)

your callback function, optionally bound to the context you provide when calling `.start()`.

#### Defined in

[index.ts:60](/packages/periodical/src/index.ts#L60)

___

### interval

• **interval**: `number`

the interval in milliseconds.

#### Defined in

[index.ts:55](/packages/periodical/src/index.ts#L55)

___

### timeoutId

• **timeoutId**: `undefined` \| `Timeout`

the id for the last `setTimeout()` call.

#### Defined in

[index.ts:65](/packages/periodical/src/index.ts#L65)

## Methods

### exec

▸ **exec**(): `void`

Executes your callback and enqueues the next run / execution

#### Returns

`void`

#### Defined in

[index.ts:127](/packages/periodical/src/index.ts#L127)

___

### isRunning

▸ **isRunning**(): `boolean`

Reports whether or not your periodical is running

#### Returns

`boolean`

#### Defined in

[index.ts:119](/packages/periodical/src/index.ts#L119)

___

### msUntilNextRun

▸ **msUntilNextRun**(`now?`): `number`

Calculates the number of milliseconds until next run / execution

#### Parameters

| Name | Type |
| :------ | :------ |
| `now?` | `Date` |

#### Returns

`number`

#### Defined in

[index.ts:140](/packages/periodical/src/index.ts#L140)

___

### start

▸ **start**(`fn`, `ctx?`): `void`

Starts your periodical running

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | [`Callback`](../README.md#callback) | the function you'd like executed |
| `ctx?` | `object` | the context in which you'd like your function executed (optional) |

#### Returns

`void`

**`Example`**

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

#### Defined in

[index.ts:97](/packages/periodical/src/index.ts#L97)

___

### stop

▸ **stop**(): `void`

Stops your periodical

#### Returns

`void`

**`Example`**

```ts
p.stop();
p.isRunning(); // 'false'
```

#### Defined in

[index.ts:111](/packages/periodical/src/index.ts#L111)
