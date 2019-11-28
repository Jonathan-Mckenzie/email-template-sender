import { EmailService, IEmailOptions, IPreviewOptions } from "../model/emailService.interface";
import axios, {AxiosResponse} from 'axios';


export class HandlebarsSendGridService extends EmailService {

	generatePreview(options: IPreviewOptions): Promise<{__html: string}> {
		return axios.post(
			`${process.env.REACT_APP_API_HOSTNAME}/mail/preview`,
			options
		).then( (response: AxiosResponse) => {
			if (response.data.error) {
				// throw new Error(response.data.error);
				return {
					__html: `<div style="color: red; white-space: pre">${response.data.error}</div>`
				};
			} else {
				return {
					__html: response.data.render
				};
			}
		});
	}

	sendEmail(options: IEmailOptions): Promise<{success: boolean}> {
		return axios.post(
			`${process.env.REACT_APP_API_HOSTNAME}/mail/send`,
			options
		).then( (response: AxiosResponse) => {
			return {
				success: true
			};
		});
	}
}
