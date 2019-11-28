const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(<string>process.env.SENDGRID_API_KEY);

import {ClientResponse} from "@sendgrid/client/src/response";
import {ResponseError} from "@sendgrid/helpers/classes";
import { IEmailOptions } from "../../src/model/emailService.interface";


export const sendMail = (options: IEmailOptions): Promise<{success: boolean}> => {

	const msg = {
		to: options.receiverEmail,
		from: options.senderEmail,
		subject: options.subject,
		text: 'Sent from SendGrid!',
		html: options.template,
	};

	const maxRetryCount = 3;
	let currentCount = 0;

	return new Promise( (resolve, reject) => {
		const attemptToResolve = () => {

			if (currentCount++ >= maxRetryCount) {
				console.log('out of retries');
				return reject('out of retries');
			}

			sgMail.send(msg).then( (results: [ClientResponse, {}]) => {
				// const response: ClientResponse = results[0];
				// console.log('response: ', response);
				return resolve({success: true})
			}).catch( (err: ResponseError) => {
				if (err.code !== 400) {
					// not a bad request, retry after 100ms
					setTimeout(() => attemptToResolve(), 100);
				} else {
					return reject("bad request");
				}
			})
		};
		attemptToResolve();
	});
};

