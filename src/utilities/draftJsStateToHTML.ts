import { convertToRaw } from "draft-js";
import {EditorState} from "draft-js";
import draftToHtml from "draftjs-to-html";

export const draftJSStateToHTML = (state: EditorState) => {
	return draftToHtml(
		convertToRaw(state.getCurrentContent())
	);
};
