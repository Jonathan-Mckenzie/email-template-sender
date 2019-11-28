import { History } from "history";
import { combineReducers } from "redux";
import * as emailEditorReducer from './emailEditor';

export interface RootState {
	emailEditor: emailEditorReducer.IState;
}

export default (history: History) =>
	combineReducers({
		...emailEditorReducer,
	});
