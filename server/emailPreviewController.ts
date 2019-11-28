import { Request, Response } from "express";
import { IPreviewOptions } from "../src/model/emailService.interface";
import { renderTemplate } from "./handlebars";

export const renderPreview = (req: Request, res: Response) => {
	const options: IPreviewOptions = req.body;

	if (!options || !options.template) {
		return res.status(400).send('invalid options');
	}
	let renderedTemplate;

	try {
		renderedTemplate = renderTemplate(options.template, options.dynamicVariables);

		return res.status(200).send({
			render: renderedTemplate
		});
	} catch (e) {
		// console.error('template parse error: ', e);
		return res.status(200).send({ error: e.message });
	}
};
