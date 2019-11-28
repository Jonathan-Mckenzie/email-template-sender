
export interface IArrayDifference {
	added: string[];
	removed: string[];
	hasAdded: boolean;
	hasRemoved: boolean;
}

export const getDifferenceOfArrays = (a: string[], b: string[]): IArrayDifference => {
	// added: a does not have, b has
	const bSet = new Set(b);
	(a || []).forEach( x => bSet.delete(x) );

	// removed: a has, b does not have
	const aSet = new Set(a);
	(b || []).forEach( x => aSet.delete(x) );


	return {
		added: Array.from(bSet),
		removed: Array.from(aSet),
		hasAdded: bSet.size > 0,
		hasRemoved: aSet.size > 0
	};
};
