import { ChangeEvent, Component, default as React } from "react";
import { IDynamicVariables } from "../model/emailService.interface";
import { getDifferenceOfArrays, IArrayDifference } from "../utilities/getDifferenceOfArrays";
import { debounce } from "debounce";
import { createStyles, TextField, Theme } from "@material-ui/core";
import { compose } from "redux";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import { RootState } from "../reducers";

const styles = (theme: Theme) => {
	return createStyles({
		form: {
			display: 'flex',
			flexDirection: 'column',
		}
	});
};

type IProps = {
	onChange: (obj: IDynamicVariables) => void;
	dynamicVariables: string[];
};

type IState = {
	dynamicVariableObj: IDynamicVariables;
	variables: string[];
};

class EmailDynamicVariables extends Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);

		this.state = {
			dynamicVariableObj: {},
			variables: []
		};
	}

	componentDidMount() {
		this.processVariableDifferences(this.props.dynamicVariables);
	}

	componentDidUpdate(prevProps: IProps, prevState: IState) {
		this.processVariableDifferences(this.props.dynamicVariables);
	}

	onVariableChange = (variableName: string) => (event: ChangeEvent<any>) => {
		const value = event.target.value;
		this.setState((prevState: IState) => {
			return {
				...prevState,
				dynamicVariableObj: {
					...prevState.dynamicVariableObj,
					[variableName]: value
				}
			};
		}, this.postStateUpdate);
	};

	private processVariableDifferences = (nextDynamicVariables: string[]) => {
		// loop over
		const currentKeys = Object.keys(this.state.dynamicVariableObj);
		const difference: IArrayDifference = getDifferenceOfArrays(currentKeys, nextDynamicVariables);

		if (difference.hasAdded || difference.hasRemoved) {
			const nextObj = {...this.state.dynamicVariableObj};
			difference.removed.forEach( removedKey => {
				delete nextObj[removedKey];
			});
			difference.added.forEach( addedKey => {
				nextObj[addedKey] = '';
			});
			this.setState({
				dynamicVariableObj: nextObj,
				variables: nextDynamicVariables,
			}, this.postStateUpdate);
		}
	};

	private postStateUpdate = () => {
		this.props.onChange(this.state.dynamicVariableObj);
	};

	render() {
		return (
			this.state.variables.map( variable => (
				<TextField
					key={variable}
					defaultValue={this.state.dynamicVariableObj[variable]}
					label={variable}
					onChange={this.onVariableChange(variable)}
					variant="outlined"
				/>
			))
		);
	}

}

export default compose(
	withStyles(styles),
	connect((state: RootState) => ({
		dynamicVariables: state.emailEditor.dynamicVariables,
	}))
)(EmailDynamicVariables) as any;
