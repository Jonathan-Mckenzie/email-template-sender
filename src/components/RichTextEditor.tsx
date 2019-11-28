import * as React from "react";
import MUIRichTextEditor from 'mui-rte'
import { EditorState, convertToRaw } from "draft-js";
import {draftJSStateToHTML} from "../utilities/draftJsStateToHTML";
import {stateFromHTML} from 'draft-js-import-html';
import { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import {compose} from 'redux';
import { connect } from "react-redux";
import { RootState } from "../reducers";


type IProps = {
	classes: {[key: string]: string};
	onChange?: (html: string) => void;
	label?: string;
	initialSubject: string;
	initialTemplate: string;
};

interface IState {
	isInitialized: boolean;
	initialSubject: string;
	initialTemplate: string;
}

class RichTextEditor extends Component<IProps, IState> {

	private readonly controls: Array<string>;
	private readonly defaultTheme: any;

	constructor(props: IProps) {
		super(props);

		const controlsSet = new Set([
			"title",
			"bold",
			"italic",
			"underline",
			"strikethrough",
			"highlight",
			"undo",
			"redo",
			"link",
			"media",
			"numberList",
			"bulletList",
			"quote",
			"code",
			"clear",
			"save"
		]);

		// removed controls from text editor
		controlsSet.delete("media");
		controlsSet.delete("code");
		controlsSet.delete("clear");
		controlsSet.delete("save");
		controlsSet.delete("highlight");

		this.controls = Array.from(controlsSet);

		this.defaultTheme = createMuiTheme();

		Object.assign(this.defaultTheme, {
			overrides: {
				MUIRichTextEditor: {
					toolbar: {
						borderBottom: '1px solid black',
					}
				}
			}
		});

		this.state = {
			isInitialized: false,
			initialSubject: this.props.initialSubject,
			initialTemplate: this.props.initialTemplate,
		};
	}

	templateChangeHandler = (state: EditorState) => {
		if (this.props.onChange) {
			this.props.onChange( draftJSStateToHTML(state) );
		}
	};

	render() {

		const label = this.props.label || 'Start typing...';

		const initialTemplate = JSON.stringify(
			convertToRaw(
				stateFromHTML(this.state.initialTemplate)
			)
		);

		return (
			<>
				<MuiThemeProvider theme={this.defaultTheme}>
					<MUIRichTextEditor
						value={initialTemplate}
						classes={this.props.classes}
						label={label}
						onChange={this.templateChangeHandler}
						controls={Array.from(this.controls)}
					/>
				</MuiThemeProvider>
			</>
		);
	}
}


export default compose(
	connect((state: RootState) => ({
		initialSubject: state.emailEditor.initialSubjectLine,
		initialTemplate: state.emailEditor.initialEmailTemplate,
	})),
)(RichTextEditor) as any;
