import { renderTemplate } from "../handlebars";

import * as SendGrid from './sendgrid';
import * as TestMail from './testmail';

import { Request, Response } from "express";
import { IEmailOptions } from "../../src/model/emailService.interface";

const isOptionsValid = (options: IEmailOptions): boolean => {
	return !!(options && options.subject && options.template);
};

const processEmailOptions = (options: IEmailOptions): void => {
	options.subject = renderTemplate(options.subject, options.dynamicVariables);
	options.template = renderTemplate(options.template, options.dynamicVariables);
};

export const send = (req: Request, res: Response) => {

	const emailOptions: IEmailOptions = req.body;

	if (!isOptionsValid(emailOptions)) {
		return res.status(400).send({success: false});
	}

	processEmailOptions(emailOptions);

	let sendMail = (process.env.TEST_MAIL) ? TestMail.sendMail : SendGrid.sendMail;

	sendMail(emailOptions).then( response => {
		return res.status(200).send({success: true});
	}).catch( err => {
		return res.status(500).send({success: false});
	});
};

