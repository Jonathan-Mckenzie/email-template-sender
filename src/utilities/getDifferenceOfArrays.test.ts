import { getDifferenceOfArrays } from "./getDifferenceOfArrays";

it("should detect when elements are added", function() {

	const difference = getDifferenceOfArrays(
		['a','b','c'],
		['a','b','c','d']
	);

	expect(difference.added).toEqual(['d']);
	expect(difference.hasAdded).toEqual(true);
	expect(difference.removed).toEqual([]);
	expect(difference.hasRemoved).toEqual(false);
});

it("should detect when elements are both removed", function() {

	const difference = getDifferenceOfArrays(
		['a','b','c'],
		['a','b']
	);

	expect(difference.added).toEqual([]);
	expect(difference.hasAdded).toEqual(false);
	expect(difference.removed).toEqual(['c']);
	expect(difference.hasRemoved).toEqual(true);
});

it("should detect when elements are both added and removed", function() {

	const difference = getDifferenceOfArrays(
		['a','b','c'],
		['b','c','d']
	);

	expect(difference.added).toEqual(['d']);
	expect(difference.hasAdded).toEqual(true);
	expect(difference.removed).toEqual(['a']);
	expect(difference.hasRemoved).toEqual(true);
});
