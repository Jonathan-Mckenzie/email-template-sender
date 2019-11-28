import { handlebarsVariableParser } from "./handlebarsVariableParser";

it("return an empty list with no valid variables", function() {
	expect(handlebarsVariableParser('')).toEqual([]);

	expect(handlebarsVariableParser(`
		one_variable
	`)).toEqual([]);

	expect(handlebarsVariableParser(`
		{{one_variable one_variable 
	`)).toEqual([]);

	expect(handlebarsVariableParser(`
		{{one_variable     one_variable}}
	`)).toEqual([]);
});

it("be able to parse a single variable", function() {
	expect(handlebarsVariableParser(`
		{{one_variable}}
	`)).toEqual(['one_variable']);

	expect(handlebarsVariableParser(`
		{{one_variable}} {{one_variable}}
	`)).toEqual(['one_variable']);

	expect(handlebarsVariableParser(`
		{{one_variable}} not a variable {{one_variable}}
	`)).toEqual(['one_variable']);
});

it("be able to parse more than one variable", function() {
	expect(handlebarsVariableParser(`
		{{one_variable}} {{two_variable}}
	`)).toEqual(['one_variable', 'two_variable']);

	expect(handlebarsVariableParser(`
		{{one_variable}} one_variable {{two_variable}}
	`)).toEqual(['one_variable', 'two_variable']);

	expect(handlebarsVariableParser(`
		{{one_variable}} one_variable {{two_variable}} {{two_variable}}
	`)).toEqual(['one_variable', 'two_variable']);
});

it("parse variables with three curley braces", function() {
	expect(handlebarsVariableParser(`
		{{{one_variable}}}
	`)).toEqual(['one_variable']);

	expect(handlebarsVariableParser(`
		{{{one_variable}}} {{{two_variable}}}
	`)).toEqual(['one_variable', 'two_variable']);

	expect(handlebarsVariableParser(`
		{{one_variable}} {{{two_variable}}}
	`)).toEqual(['one_variable', 'two_variable']);
});
