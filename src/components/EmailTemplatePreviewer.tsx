import * as React from 'react';
import { Component } from "react";
import { EmailService, IDynamicVariables } from "../model/emailService.interface";
import { compose } from "redux";
import { WithStyles, withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import { RootState } from "../reducers";
import { ChangeEvent } from "react";
import { createStyles, TextField, Theme } from "@material-ui/core";
import { debounce } from "debounce";
import { processVariableChange, processVariableDifferences } from "../utilities/dynamicVariablesUpdator";


const styles = (theme: Theme) => {
	return createStyles({
		form: {
			display: 'flex',
			flexDirection: 'column',
		},
		content: {
			border: '1px solid black',
			borderRadius: '5px',
			padding: '1rem',
		},
		dynamicVariable: {
			marginBottom: '0.5rem'
		}
	});
};

type IProps = {
	emailService: EmailService;
	subjectLine: string;
	emailTemplate: string;
	dynamicVariables: string[];
} & WithStyles<typeof styles>;

type IState = {
	subject: {__html: string};
	preview: {__html: string};
	dynamicVariableObj: IDynamicVariables;
	variables: string[];
}

class EmailTemplatePreviewer extends Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);

		this.state = {
			subject: {__html: '<div>Your subject line goes here</div>'},
			preview: {__html: '<div>Your preview goes here</div>'},
			dynamicVariableObj: {},
			variables: [],
		};
	}

	componentDidMount() {
		this.updateVariableDifferences(this.props.dynamicVariables, {});
	}

	componentDidUpdate(prevProps: IProps, prevState: IState) {
		this.updateVariableDifferences(this.props.dynamicVariables, prevProps);
	}

	onVariableChange = (variableName: string) => (event: ChangeEvent<any>) => {
		const value = event.target.value;
		this.setState({
			dynamicVariableObj: processVariableChange(this.state.dynamicVariableObj, variableName, value)
		}, () => this.postStateUpdate(true, true));
	};

	private updateVariableDifferences = (nextDynamicVariables: string[], prevProps: any) => {
		const nextObj = processVariableDifferences(this.state.dynamicVariableObj, nextDynamicVariables);
		if (nextObj) {
			this.setState({
				dynamicVariableObj: nextObj,
				variables: nextDynamicVariables,
			}, () => this.postStateUpdate(true, true));
		} else if (prevProps) {
			this.postStateUpdate(
				prevProps.subjectLine !== this.props.subjectLine,
				prevProps.emailTemplate !== this.props.emailTemplate
			);
		}
	};

	private postStateUpdate = debounce((subjectChanged: boolean, templateChanged: boolean) => {
		if (subjectChanged) {
			this.props.emailService.generatePreview({
				template: this.props.subjectLine,
				dynamicVariables: this.state.dynamicVariableObj
			}).then( subject => {
				this.setState({subject})
			});
		}
		if (templateChanged) {
			this.props.emailService.generatePreview({
				template: this.props.emailTemplate,
				dynamicVariables: this.state.dynamicVariableObj
			}).then( preview => {
				this.setState({preview})
			});
		}
	}, 250);

	render() {
		const {classes} = this.props;

		return (
			<form>
				<h3>Email Preview</h3>
				<h5>Subject Line</h5>
				<div
					dangerouslySetInnerHTML={this.state.subject}
				/>
				<h5>Email Body</h5>
				<div
					className={classes.content}
					dangerouslySetInnerHTML={this.state.preview}
				/>

				<h5>Preview Test Variables</h5>
				<div className={classes.form}>
					{this.state.variables.map( variable => (
						<TextField
							key={variable}
							className={classes.dynamicVariable}
							defaultValue={this.state.dynamicVariableObj[variable]}
							label={variable}
							onChange={this.onVariableChange(variable)}
							variant="outlined"
						/>
					))}
				</div>
			</form>
		);
	}

}

export default compose(
	withStyles(styles),
	connect((state: RootState) => ({
		subjectLine: state.emailEditor.subjectLine,
		emailTemplate: state.emailEditor.emailTemplate,
		dynamicVariables: state.emailEditor.dynamicVariables,
	}))
)(EmailTemplatePreviewer) as any;
