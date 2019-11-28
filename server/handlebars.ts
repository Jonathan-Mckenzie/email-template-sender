import * as Handlebars from 'handlebars';
import { IDynamicVariables } from "../src/model/emailService.interface";

export const renderTemplate = (template: string, dynamicVariables: IDynamicVariables) => {
	const builtTemplate = Handlebars.compile(template);
	return builtTemplate(dynamicVariables);
};
