

const handlebarsRegex = /{{{?(#[a-z]+ )?[a-z_-]+.[a-z_-]*}?}}/g;
const curlyBraceRegex = /[{}]/g;

export const handlebarsVariableParser = (template: string = ''): string[] => {
	const uniqueSet: Set<string> = new Set();
	(template.match(handlebarsRegex) || []).forEach( (match: string) => {
		uniqueSet.add(match.replace(curlyBraceRegex, ''));
	});
	return Array.from(uniqueSet);
};
