export const createSubstitutionPtn = (start, end) => {
	return new RegExp(`${start}[\\s\\S]*?${end}`, 'gmi');
};

