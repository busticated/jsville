# @bust/periodical

Runs a given function at a given interval normalized to clock time such that
each execution happens "on the dot" - e.g.

```
10s interval: 12:00:10, 12:00:20, 12:00:30, etc
30s interval: 12:00:30, 12:01:00, 12:01:30, etc
 1m interval: 12:01:00, 12:02:00, 12:03:00, etc
30m interval: 12:30:00, 13:00:00, 13:30:00, etc
 1h interval: 13:00:00, 14:00:00, 15:00:00, etc
```

NOTE: Due to how `setTimeout()` works (see [docs](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#reasons_for_delays_longer_than_specified)),
you can expect some drift. In practice, it tends not to matter - delta tends
to be < 5ms - but if you need high-accuracy and ironclad reliability, definitely
reach for a different tool 🤗

## Table of contents

### Classes

- [Periodical](classes/Periodical.md)

### Type Aliases

- [Callback](README.md#callback)

## Type Aliases

### Callback

Ƭ **Callback**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[index.ts:21](/packages/periodical/src/index.ts#L21)
