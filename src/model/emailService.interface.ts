
export type IDynamicVariables = {[key: string]: string};


export interface IEmailOptions {
	subject: string;
	senderEmail: string;
	receiverEmail: string;
	template: string;
	dynamicVariables: IDynamicVariables;
}

export enum EmailStatus {
	QUEUED = 'QUEUED',
	SENDING = 'SENDING',
	SUCCESS = 'SUCCESS',
	FAILED = 'FAILED',
}

export interface IPackagedEmail {
	id: string;
	status: EmailStatus;
	options: IEmailOptions
}


export interface IPreviewOptions {
	template: string;
	dynamicVariables: IDynamicVariables;
}

export abstract class EmailService {

	abstract generatePreview(options: IPreviewOptions): Promise<{__html: string}>;
	abstract sendEmail(options: IEmailOptions): Promise<{success: boolean}>;

}
