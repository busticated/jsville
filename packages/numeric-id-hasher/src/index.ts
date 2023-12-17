/**
 * Converts a large stringified number into a hash - handy for creating shortened
 * urls like:
 *
 * ```
 * example.com/u/67458932454109883456 -> example.com/u/7vy6d8rw4SPh
 * ```
 *
 * @packageDocumentation
 */


const CHAR_TABLE = '23456789ABCDEFGHJKLMNPRSTUVWXYZabcdefghjkmnpqrstuvwxyz';
const BASE = BigInt(CHAR_TABLE.length);
const IS_ONLY_DIGITS_PTN = /^\d*$/;
const ZERO = BigInt(0);


/**
 * Encodes your id
 *
 * @example
 * ```ts
 * import { encode } from '@bust/numeric-id-hasher';
 * encode('67458932454109883456'); // '7vy6d8rw4SPh'
 * ```
 */
export const encode = (id: string) => {
	if (!IS_ONLY_DIGITS_PTN.test(id)){
		throw new Error('only ids with digits 0-9 can be encoded');
	}

	let num = BigInt(id);
	const result = [];

	do {
		const idx = Number(num % BASE);
		result.push(CHAR_TABLE[idx]);
		num = num / BASE;
	} while (num > ZERO);

	return result.reverse().join('');
};

/**
 * Decodes your hash back into the originally provided id
 *
 * @example
 * ```ts
 * import { decode } from '@bust/numeric-id-hasher';
 * decode('7vy6d8rw4SPh'); // '67458932454109883456'
 * ```
 */
export const decode = (hash: string) => {
	let result = BigInt(0);
	let charIndex, i;

	hash = hash.split('').reverse().join('');

	for (i = 0; i < hash.length; i++){
		charIndex = BigInt(CHAR_TABLE.indexOf(hash.charAt(i)));
		result = (BASE ** BigInt(i)) * charIndex + result;
	}

	return result.toString();
};

