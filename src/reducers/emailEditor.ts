import { ActionType } from "../model";
import * as Actions from '../actions/emailEditor';
import createReducer from "./createReducer";
import { EmailStatus, IPackagedEmail } from "../model/emailService.interface";


export interface IState {
	initialSubjectLine: string;
	initialEmailTemplate: string;
	subjectLine: string;
	emailTemplate: string;
	dynamicVariables: string[];
	packagedEmails: IPackagedEmail[];
}

const initialState: IState = {
	initialSubjectLine: '',
	initialEmailTemplate: '',
	subjectLine: '',
	emailTemplate: '',
	dynamicVariables: [],
	packagedEmails: [],
};

export const emailEditor = createReducer(initialState, {
	'persist/REHYDRATE': (state: any, action: any) => {
		if (action.payload && action.payload.emailEditor) {
			return {
				...state,
				initialSubjectLine: action.payload.emailEditor.subjectLine,
				initialEmailTemplate: action.payload.emailEditor.emailTemplate,
				subjectLine: action.payload.emailEditor.subjectLine,
				emailTemplate: action.payload.emailEditor.emailTemplate,
				dynamicVariables: action.payload.emailEditor.dynamicVariables,
			};
		} else {
			return state;
		}
	},
	[ActionType.UPDATE_EMAIL_SUBJECT]: (state: IState, action: Actions.UpdateEmailSubjectAction) => {
		const nextDynamicVariables = action.payload.parser(state.emailTemplate + action.payload.html);
		return {
			...state,
			subjectLine: action.payload.html,
			dynamicVariables: nextDynamicVariables,
		};
	},
	[ActionType.UPDATE_EMAIL_TEMPLATE]: (state: IState, action: Actions.UpdateEmailTemplateAction) => {
		const nextDynamicVariables = action.payload.parser(state.subjectLine + action.payload.html);
		return {
			...state,
			emailTemplate: action.payload.html,
			dynamicVariables: nextDynamicVariables,
		};
	},
	[ActionType.QUEUE_EMAIL]: (state: IState, action: Actions.QueueEmailAction) => {
		// assign it an id, and a status
		const newPackagedEmail: IPackagedEmail = {
			id: Date.now() + '',
			status: EmailStatus.QUEUED,
			options: action.payload
		};
		const nextPackagedEmails = [...state.packagedEmails, newPackagedEmail];
		return {
			...state,
			packagedEmails: nextPackagedEmails
		};
	},
	[ActionType.UPDATE_EMAIL_STATUS]: (state: IState, action: Actions.UpdateEmailStatusAction) => {
		const nextPackagedEmails = state.packagedEmails.map( email => {
			let nextStatus;
			if (email.id === action.payload.id) {
				nextStatus = action.payload.status;
			} else {
				nextStatus = email.status;
			}
			return {
				...email,
				status: nextStatus
			};
		});
		return {
			...state,
			packagedEmails: nextPackagedEmails
		};
	},
	[ActionType.REMOVE_EMAIL]: (state: IState, action: Actions.RemoveEmailAction) => {
		return {
			...state,
			packagedEmails: state.packagedEmails.filter( email => email.id !== action.payload ),
		};
	}
});


