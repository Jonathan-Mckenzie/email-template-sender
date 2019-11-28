import * as React from 'react';
import { TextField } from "@material-ui/core";
import { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { RootState } from "../reducers";


type IProps = {
	className: string;
	onChange: (subjectLine: string) => void;
	initialSubject: string;
};

type IState = {
	initialSubject: string;
};

class SubjectLineEditor extends Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);

		this.state = {
			initialSubject: props.initialSubject
		};
	}

	subjectLineChangeHandler = (event: any) => {
		const line = event.target.value;
		if (this.props.onChange) {
			this.props.onChange(line);
		}
	};

	render() {

		const {className} = this.props;
		const {initialSubject} = this.state;

		return (
			<TextField
				className={className}
				defaultValue={initialSubject}
				label="Subject line"
				onChange={this.subjectLineChangeHandler}
				variant="outlined"
			/>
		);
	}
}



export default compose(
	connect((state: RootState) => ({
		initialSubject: state.emailEditor.initialSubjectLine,
	})),
)(SubjectLineEditor) as any;
