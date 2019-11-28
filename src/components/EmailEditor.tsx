import * as React from "react";
import RichTextEditor from "./RichTextEditor";
import { useActions } from "../actions";
import * as EmailEditorActions from '../actions/emailEditor';
import { IDynamicTemplateVariableParser } from "../model/dynamicTemplateVariableParser.interface";
import EmailTemplatePreviewer from './EmailTemplatePreviewer';
import { HandlebarsSendGridService } from "../services/handlebarsSendGridService";
import EmailSender from "./EmailSender";
import EmailProcessor from "./EmailProcessor";
import { makeStyles } from "@material-ui/styles";
import { Theme, WithStyles } from "@material-ui/core";
import SubjectLineEditor from "./SubjectLineEditor";


const useStyles = makeStyles((theme: Theme) => ({
	root: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
	},
	element: {
		flex: '0 0 50%',
		padding: '1rem',
	},
	subjectLine: {
		width: '100%',
		marginBottom: '1rem',
	},
	richTextEditor: {
		border: '1px solid black',
		borderRadius: '5px',
		padding: '1rem',
	},
	sender: {
		margin: '1rem 0',
		textAlign: 'right',
	},
}));


type IProps = {
	templateParser: IDynamicTemplateVariableParser;
};

const EmailEditor = (props: IProps) => {

	const classes = useStyles();
	const emailEditorActions: EmailEditorActions.ActionFunctions = useActions(EmailEditorActions);

	const subjectChangeHandler = (line: string) => {
		emailEditorActions.UpdateEmailSubject(line, props.templateParser);
	};

	const templateChangeHandler = (html: string) => {
		emailEditorActions.UpdateEmailTemplate(html, props.templateParser)
	};

	const emailService = new HandlebarsSendGridService();


	return (
		<>
			<div className={classes.root}>
				<div className={classes.element}>
					<h3>Email Template</h3>
					<SubjectLineEditor
						className={classes.subjectLine}
						onChange={subjectChangeHandler}
					/>
					<RichTextEditor
						classes={{ root: classes.richTextEditor }}
						label="Start typing the email body here..."
						onChange={templateChangeHandler}
					/>
					<div className={classes.sender}>
						<EmailSender />
					</div>
				</div>
				<div className={classes.element}>
					<EmailTemplatePreviewer
						emailService={emailService}
					/>

				</div>
			</div>
			<EmailProcessor emailService={emailService}/>
		</>
	);
};




export default EmailEditor;

