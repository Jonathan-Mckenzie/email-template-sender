
export enum ActionType {
	UPDATE_EMAIL_SUBJECT = '[email editor] update email subject',
	UPDATE_EMAIL_TEMPLATE = '[email editor] update email template',
	QUEUE_EMAIL = '[email sender] queue email',
	UPDATE_EMAIL_STATUS = '[email sender] update status',
	REMOVE_EMAIL = '[email sender] remove email',
}

export interface Action<T> {
	type: ActionType;
	payload: T;
}
