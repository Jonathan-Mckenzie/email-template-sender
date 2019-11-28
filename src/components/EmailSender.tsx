import * as React from 'react';
import { Button, createStyles, Drawer, TextField, Theme } from "@material-ui/core";
import { IEmailOptions } from "../model/emailService.interface";
import { Component } from "react";
import { compose } from "redux";
import { WithStyles, withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import { RootState } from "../reducers";
import { ChangeEvent } from "react";
import { processVariableChange, processVariableDifferences } from "../utilities/dynamicVariablesUpdator";
import { QueueEmail } from "../actions/emailEditor";

const styles = (theme: Theme) => {
	return createStyles({
		form: {
			display: 'flex',
			flexDirection: 'column',
			padding: '2rem',
			minWidth: '500px',
		},
		element: {
			marginBottom: '0.5rem',
		}
	});
};

type IProps = {
	subjectLine: string;
	emailTemplate: string;
	dynamicVariables: string[];
	queueEmail: (payload: IEmailOptions) => void;
} & WithStyles<typeof styles>;

type IState = {
	open: boolean;
	emailOptions: IEmailOptions;
	variables: string[];
};

class EmailSender extends Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);

		this.state = {
			open: false,
			emailOptions: {
				subject: '',
				senderEmail: '',
				receiverEmail: '',
				dynamicVariables: {},
				template: ''
			},
			variables: []
		};
	}

	get emailOptions(): IEmailOptions {
		return {
			...this.state.emailOptions,
			subject: this.props.subjectLine,
			template: this.props.emailTemplate,
		};
	}

	componentDidMount() {
		const nextObj = processVariableDifferences(this.state.emailOptions.dynamicVariables, this.props.dynamicVariables);
		if (nextObj) {
			this.setState((state: IState) => {
				return {
					...state,
					emailOptions: {
						...state.emailOptions,
						dynamicVariables: nextObj,
					},
					variables: this.props.dynamicVariables
				}
			})
		}
	}

	openDrawer = () => {
		const nextObj = processVariableDifferences(this.state.emailOptions.dynamicVariables, this.props.dynamicVariables);

		if (nextObj) {
			this.setState((state: IState) => {
				return {
					...state,
					emailOptions: {
						...state.emailOptions,
						dynamicVariables: nextObj,
					},
					variables: this.props.dynamicVariables
				}
			})
		} else {
			this.setState({
				open: true,
			});
		}
	};
	closeDrawer = () => {
		this.setState({open: false});
	};

	updateEmailOptions = (type: string) => (event: any) => {
		const value = event.target.value;
		this.setState((state: IState) => {
			return {
				...state,
				emailOptions: {
					...state.emailOptions,
					[type]: value
				}
			};
		})
	};

	onVariableChange = (variableName: string) => (event: ChangeEvent<any>) => {
		const value = event.target.value;
		this.setState((state: IState) => {
			return {
				...state,
				emailOptions: {
					...state.emailOptions,
					dynamicVariables: processVariableChange(this.state.emailOptions.dynamicVariables, variableName, value),
				},
			}
		})
	};

	sendMail = () => {
		this.props.queueEmail(this.emailOptions);
		this.closeDrawer();
	};

	render() {

		const {classes} = this.props;
		const {open, emailOptions} = this.state;


		return (
			<>
				<Button variant="contained"
					color="primary"
					href=""
					onClick={this.openDrawer}>
					Compose
				</Button>
				<Drawer anchor="right" open={open} onClose={this.closeDrawer}>
					<div className={classes.form}>
						<h3>Email Composer</h3>
						<form className={classes.form}>
							<TextField
								className={classes.element}
								label="Sender Email"
								variant="outlined"
								onChange={this.updateEmailOptions('senderEmail')}
							/>

							<TextField
								className={classes.element}
								label="Receiver Email"
								variant="outlined"
								onChange={this.updateEmailOptions('receiverEmail')}
							/>

							<h5>Email Variables</h5>

							{this.state.variables.map( variable => (
								<TextField
									key={variable}
									className={classes.element}
									defaultValue={emailOptions.dynamicVariables[variable]}
									label={variable}
									onChange={this.onVariableChange(variable)}
									variant="outlined"
								/>
							))}
						</form>

						<Button variant="contained"
								color="primary"
								href=""
								onClick={this.sendMail}>
							Send
						</Button>
					</div>

				</Drawer>
			</>
		);
	}
}


export default compose(
	withStyles(styles),
	connect((state: RootState) => ({
		subjectLine: state.emailEditor.subjectLine,
		emailTemplate: state.emailEditor.emailTemplate,
		dynamicVariables: state.emailEditor.dynamicVariables,
	}), (dispatch => ({
		queueEmail: (payload: IEmailOptions) => dispatch(QueueEmail(payload))
	})))
)(EmailSender) as any;

