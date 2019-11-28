import { Action, ActionType } from "../model";
import { IDynamicTemplateVariableParser } from "../model/dynamicTemplateVariableParser.interface";
import { EmailStatus, IEmailOptions } from "../model/emailService.interface";

export interface IUpdateEmailTemplate {
	html: string;
	parser: IDynamicTemplateVariableParser;
}

export type UpdateEmailSubjectAction = Action<IUpdateEmailTemplate>;
export const UpdateEmailSubject = (html: string, parser: IDynamicTemplateVariableParser): UpdateEmailTemplateAction => {
	return {
		type: ActionType.UPDATE_EMAIL_SUBJECT,
		payload: { html,  parser, }
	}
};

export type UpdateEmailTemplateAction = Action<IUpdateEmailTemplate>;
export const UpdateEmailTemplate = (html: string, parser: IDynamicTemplateVariableParser): UpdateEmailTemplateAction => {
	return {
		type: ActionType.UPDATE_EMAIL_TEMPLATE,
		payload: { html,  parser, }
	}
};

export type QueueEmailAction = Action<IEmailOptions>;
export const QueueEmail = (options: IEmailOptions): QueueEmailAction => {
	return {
		type: ActionType.QUEUE_EMAIL,
		payload: options,
	}
};

export type UpdateEmailStatusAction = Action<{id: string, status: EmailStatus}>;
export const UpdateEmailStatus = (id: string, status: EmailStatus): UpdateEmailStatusAction => {
	return {
		type: ActionType.UPDATE_EMAIL_STATUS,
		payload: {id, status},
	}
};

export type RemoveEmailAction = Action<string>;
export const RemoveEmail = (id: string): RemoveEmailAction => {
	return {
		type: ActionType.REMOVE_EMAIL,
		payload: id,
	}
};


export type ActionFunctions = {
	UpdateEmailSubject: typeof UpdateEmailSubject,
	UpdateEmailTemplate: typeof UpdateEmailTemplate,
	QueueEmail: typeof QueueEmail,
	UpdateEmailStatus: typeof UpdateEmailStatus,
	RemoveEmail: typeof RemoveEmail,
};


