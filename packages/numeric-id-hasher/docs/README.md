# @bust/numeric-id-hasher

Converts a large stringified number into a hash - handy for creating shortened
urls like:

```
example.com/u/67458932454109883456 -> example.com/u/7vy6d8rw4SPh
```

## Table of contents

### Functions

- [decode](README.md#decode)
- [encode](README.md#encode)

## Functions

### decode

▸ **decode**(`hash`): `string`

Decodes your hash back into the originally provided id

#### Parameters

| Name | Type |
| :------ | :------ |
| `hash` | `string` |

#### Returns

`string`

**`Example`**

```ts
import { decode } from '@bust/numeric-id-hasher';
decode('7vy6d8rw4SPh'); // '67458932454109883456'
```

#### Defined in

[index.ts:54](/packages/numeric-id-hasher/src/index.ts#L54)

___

### encode

▸ **encode**(`id`): `string`

Encodes your id

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`string`

**`Example`**

```ts
import { encode } from '@bust/numeric-id-hasher';
encode('67458932454109883456'); // '7vy6d8rw4SPh'
```

#### Defined in

[index.ts:28](/packages/numeric-id-hasher/src/index.ts#L28)
