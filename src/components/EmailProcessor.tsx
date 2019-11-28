import * as React from "react";
import { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { RootState } from "../reducers";
import { EmailService, EmailStatus, IPackagedEmail } from "../model/emailService.interface";
import { RemoveEmail, UpdateEmailStatus } from "../actions/emailEditor";
import SnackbarUpdates from "./SnackbarUpdates";



type IProps = {
	emailService: EmailService,
	packagedEmails: IPackagedEmail[]
	updateEmailStatus: (id: string, status: EmailStatus) => void,
	removeEmail: (id: string) => void,
}

type IState = {}

class EmailProcessor extends Component<IProps, IState> {

	componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>): void {
		this.processEmails(this.props.packagedEmails);
	}

	processEmails(emails: IPackagedEmail[]) {
		// find queued emails and send them out
		emails.filter( email =>
			email.status === EmailStatus.QUEUED
		).forEach( email => {
			this.processEmail(email);
		})
	}

	handleClose = (id: string) => () => {
		this.props.removeEmail(id);
	};

	handleRetry = (email: IPackagedEmail) => () => {
		this.processEmail(email);
	};

	private processEmail = (email: IPackagedEmail) => {
		this.props.updateEmailStatus(email.id, EmailStatus.SENDING);
		this.props.emailService.sendEmail(email.options).then( success => {
			this.props.updateEmailStatus(email.id, EmailStatus.SUCCESS);
		}).catch( error => {
			this.props.updateEmailStatus(email.id, EmailStatus.FAILED);
		});
	};

	render() {
		const snackbars = this.props.packagedEmails.map( email => {
			switch (email.status) {
				case EmailStatus.FAILED: {
					return {
						id: email.id,
						variant: 'error',
						message: `Failed to send email to ${email.options.receiverEmail}`,
						handleRetry: this.handleRetry(email)
					};
				}
				case EmailStatus.QUEUED:
				case EmailStatus.SENDING: {
					return {
						id: email.id,
						variant: 'info',
						message: `Sending email to ${email.options.receiverEmail}`
					};
				}
				case EmailStatus.SUCCESS: {
					return {
						id: email.id,
						variant: 'success',
						message: `Successfully sent email to ${email.options.receiverEmail}`
					};
				}
			}
		});

		return (
			<>
				{snackbars.map( snackbar => (
					<SnackbarUpdates
						key={snackbar.id}
						handleClose={this.handleClose(snackbar.id)}
						{...snackbar}/>
				))}
			</>
		);
	}
}

export default compose(
	connect((state: RootState) => ({
		packagedEmails: state.emailEditor.packagedEmails
	}), (dispatch => ({
		updateEmailStatus: (id: string, status: EmailStatus) => dispatch(UpdateEmailStatus(id, status)),
		removeEmail: (id: string) => dispatch(RemoveEmail(id)),
	})))
)(EmailProcessor) as any;
